import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { Targecy__factory } from '~common/generated/contract-types';
import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { targecyContractAddress } from '~~/constants/contracts.constants';
import { useWallet } from '~~/hooks';

// Helper Functions
// ========================================================
/**
 *
 * @param hex
 * @returns array of bytes
 */
const hexToBytes = (hex: string) => {
  for (var bytes = [], c = 0; c < hex.length; c += 2) {
    /**
     * @dev parseInt 16 = parsed as a hexadecimal number
     */
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};

/**
 * @dev Little-Endian: https://learnmeabitcoin.com/technical/little-endian
 * "Little-endian" refers to the order in which bytes of information can be processed by a computer.
 * @param bytes array of numbers for bytes
 * @returns number
 */
const fromLittleEndian = (bytes: number[]) => {
  const n256 = BigInt(256);
  let result = BigInt(0);
  let base = BigInt(1);
  bytes.forEach((byte) => {
    result += base * BigInt(byte);
    base = base * n256;
  });
  return result;
};

async function fetchAdCreatedEvents(providerUrl: string, contractAddress: string, contractAbi: any) {
  // Initialize a provider
  const provider = new ethers.providers.JsonRpcProvider(providerUrl);

  // Create a contract instance
  const contract = new ethers.Contract(contractAddress, contractAbi, provider);

  // Define the filter to get AdCreated events
  const filter = contract.filters.AdCreated();

  // Query past events based on the filter
  const events = await contract.queryFilter(filter);

  // Return the parsed events
  return events.map((event) => event.args);
}

const New = () => {
  const [creatingZKPRequest, setCreatingZKPRequest] = useState(false);
  const { writeAsync: setZKPRequestAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'setZKPRequest',
  });

  const router = useRouter();

  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    setCreatingZKPRequest(true);

    const zkpRequestMetadata = {
      title: data.title,
      description: data.description,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: zkpRequestMetadata }),
    });

    if (!metadataUploadResponse.ok) {
      const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      });
      toast.fire({
        icon: 'error',
        title: 'Error uploading metadata ' + metadataUploadResponse.statusText,
        padding: '10px 20px',
      });
      setCreatingZKPRequest(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      const schemaHash = data.schema; // extracted from PID Platform
      const schemaEnd = fromLittleEndian(hexToBytes(schemaHash));

      const createZKPRequest = await setZKPRequestAsync({
        args: [
          {
            validator: '0xeE229A1514Bf4E7AADe8384428828CE9CCc5dA1a',
            query: {
              schema: data.schema,
              slotIndex: data.slotIndex,
              operator: data.operator,
              value: [data.value],

              circuitId: 'credentialAtomicQuerySig',
            },
            metadataURI: metadataURI,
          },
        ],
      });
      const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      });
      toast.fire({
        icon: 'success',
        title: 'ZKPRequest created successfully! Tx: ' + createZKPRequest.hash,
        padding: '10px 20px',
      });

      router.push('/zkprequests');
    } catch (e) {
      const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      });
      toast.fire({
        icon: 'error',
        title: 'Error creating ad',
        padding: '10px 20px',
      });

      setCreatingZKPRequest(false);
    }
  };

  const schema = z.object({
    title: z.string().min(1).max(50).describe('Please fill the title'),
    description: z.string().min(1).max(50).describe('Please fill the description'),
    schema: z.string().describe('Please fill the schema'),
    // schemaUrl: z.string().url().describe('Please fill the schema url'),
    slotIndex: z.number().describe('Please fill the slotIndex'),
    // field: z.string().describe('Please fill the field'),
    operator: z.number().describe('Please fill the operator'),
    value: z.string().describe('Please fill the value'),
  });

  type FormValues = z.infer<typeof schema>;

  const operatorOptions = [
    {
      label: '=',
      value: 1,
    },
    {
      label: '<',
      value: 2,
    },
    {
      label: '>',
      value: 3,
    },
    {
      label: 'in',
      value: 4,
    },
    {
      label: 'not in',
      value: 5,
    },
  ];

  const [subjectFieldOptions, setSubjectFieldOptions] = useState<{ label: string; value: string }[]>([]);

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/zkprequests" className="text-primary hover:underline">
            ZKP Requests
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          <span>New</span>
        </li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
          <Formik
            initialValues={{
              title: '',
              description: '',
              schema: '',
              // schemaUrl: '',
              slotIndex: 0,
              // field: '',
              operator: 0,
              value: '',
            }}
            validationSchema={toFormikValidationSchema(schema)}
            onSubmit={() => {}}>
            {({ errors, submitCount, touched, values }) => (
              <Form className="space-y-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className={submitCount ? (errors.title ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="title">Title </label>
                    <Field name="title" type="text" id="title" placeholder="Enter Title" className="form-input" />

                    {submitCount ? (
                      errors.title ? (
                        <div className="mt-1 text-danger">{errors.title}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={submitCount ? (errors.description ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="description">Description </label>
                    <Field
                      name="description"
                      type="textarea"
                      rows={3}
                      id="description"
                      placeholder="Enter Description"
                      className="form-input"
                    />

                    {submitCount ? (
                      errors.description ? (
                        <div className="mt-1 text-danger">{errors.description}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <br />

                  <div className={submitCount ? (errors.schema ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="schema">Schema </label>
                    <Field name="schema" type="text" id="schema" placeholder="Enter Schema" className="form-input" />
                    <p>
                      {' '}
                      Refer to{' '}
                      <Link className="underline" href="https://schema-builder.polygonid.me/">
                        Schema Builder
                      </Link>
                    </p>

                    {submitCount ? (
                      errors.schema ? (
                        <div className="mt-1 text-danger">{errors.schema}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  {/* <div className={submitCount ? (errors.schemaUrl ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="schemaUrl">Schema Url </label>
                    <Field
                      name="schemaUrl"
                      type="string"
                      id="schemaUrl"
                      placeholder="Enter Schema Url"
                      onChangeCapture={async (e: any) => {
                        const schemaUrl = e.target.value;
                        try {
                          const res = await fetch(schemaUrl);
                          const json = await res.json();
                          const credentialSubject = json['properties']['credentialSubject'];
                          const subjectFieldOptions = Object.keys(credentialSubject['properties'])
                            .filter((property) => property !== 'id')
                            .map((key) => {
                              return {
                                label: key,
                                value: key,
                              };
                            });
                          setSubjectFieldOptions(subjectFieldOptions);
                        } catch (e) {
                          console.log(e);
                          setSubjectFieldOptions([]);
                        }
                      }}
                      className="form-input"
                    />

                    {submitCount ? (
                      errors.schemaUrl ? (
                        <div className="mt-1 text-danger">{errors.schemaUrl}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div> */}

                  <div className={submitCount ? (errors.slotIndex ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="slotIndex">Slot Index</label>
                    <div className="flex">
                      <Field
                        name="slotIndex"
                        type="number"
                        id="slotIndex"
                        placeholder="Enter Slot Index"
                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                      />
                    </div>
                    {submitCount ? (
                      errors.slotIndex ? (
                        <div className="mt-1 text-danger">{errors.slotIndex}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                {/* <div className={submitCount ? (errors.field ? 'has-error' : 'has-success') : ''}>
                  <label htmlFor="operator">Field</label>
                  <Select
                    classNames={{
                      control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      singleValue: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                    }}
                    placeholder="Select an option"
                    noOptionsMessage={() => 'Insert a valid schema url'}
                    id="field"
                    name="field"
                    options={subjectFieldOptions}
                    onChange={(value) => {
                      values.field = value?.value ?? '';
                    }}
                  />
                  {submitCount ? (
                    errors.field ? (
                      <div className="mt-1 text-danger">{errors.field}</div>
                    ) : (
                      <div className="mt-1 text-success"></div>
                    )
                  ) : (
                    ''
                  )}
                </div> */}

                <div className={submitCount ? (errors.operator ? 'has-error' : 'has-success') : ''}>
                  <label htmlFor="operator">Operator</label>
                  <Select
                    classNames={{
                      control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      singleValue: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                    }}
                    placeholder="Select an option"
                    id="operator"
                    name="operator"
                    options={operatorOptions}
                    onChange={(value) => {
                      values.operator = value?.value ?? 1;
                    }}
                  />
                  {submitCount ? (
                    errors.operator ? (
                      <div className="mt-1 text-danger">{errors.operator}</div>
                    ) : (
                      <div className="mt-1 text-success"></div>
                    )
                  ) : (
                    ''
                  )}
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className={submitCount ? (errors.value ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="value">Value</label>
                    <Field name="value" type="string" id="value" placeholder="Enter value" className="form-input" />
                    {submitCount ? (
                      errors.value ? (
                        <div className="mt-1 text-danger">{errors.value}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>

                {isConnected ? (
                  <button
                    type="submit"
                    disabled={creatingZKPRequest}
                    className="btn btn-primary !mt-6"
                    onClick={() => {
                      if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                        const parsed = schema.safeParse(values);
                        if (parsed.success) {
                          submitForm(parsed.data);
                        }
                      }
                    }}>
                    {creatingZKPRequest ? 'Creating Ad...' : 'Create'}
                  </button>
                ) : (
                  <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default New;
