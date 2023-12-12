import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { useAsync } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { SCHEMA } from '../../../../backend/src/constants/schemas/schemas.constant';

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { targecyContractAddress } from '~~/constants/contracts.constants';
import { useWallet } from '~~/hooks';
import { backendTrpcClient } from '~~/utils/trpc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

export const operatorOptions = [
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

export const SegmentEditorComponent = (id?: string) => {
  const [processingSegment, setProcessingSegment] = useState(false);
  const { writeAsync: setSegmentAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'setSegment',
  });
  const { writeAsync: editSegmentAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'editSegment',
  });

  const router = useRouter();

  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    console.log(data);

    setProcessingSegment(true);

    const segmentMetadata = {
      title: data.title,
      description: data.description,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: segmentMetadata }),
    });

    if (!metadataUploadResponse.ok) {
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: 'Error uploading metadata ' + metadataUploadResponse.statusText,
        padding: '10px 20px',
      });
      setProcessingSegment(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      let hash;
      if (id) {
        hash = (
          await editSegmentAsync({
            args: [
              id,
              {
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
          })
        ).hash;
      } else {
        console.log([
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
        ]);
        console.log(setSegmentAsync);
        hash = await setSegmentAsync({
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
      }
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'success',
        title: `Segment ${id ? 'edited' : 'created'} successfully! Tx: ${JSON.stringify(hash)} `,
        padding: '10px 20px',
      });

      await router.push('/segments');
    } catch (e) {
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: `Error ${id ? 'editing' : 'creating'} ad`,
        padding: '10px 20px',
      });

      setProcessingSegment(false);
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

  const [schemas, setSchemas] = useState<SCHEMA[]>([]);
  useAsync(async () => {
    const response = await backendTrpcClient.schemas.getAllSchemas.query();
    setSchemas(Object.entries(response).map(([, schema]) => schema));
  }, []);

  const [currentParams, setCurrentParams] = useState<
    { operator?: number; value?: any; slotIndex?: number; schema?: string } | undefined
  >(undefined);
  const [potentialReach, setPotentialReach] = useState<number>(0);
  useEffect(() => {
    console.log(currentParams);
    if (
      !currentParams ||
      !currentParams.operator ||
      !currentParams.value ||
      !currentParams.slotIndex ||
      !currentParams.schema
    )
      return;

    backendTrpcClient.segment.getSegmentPotentialReachByParams
      .query({
        operator: currentParams.operator,
        value: currentParams.value,
        slotIndex: currentParams.slotIndex,
        schema: currentParams.schema,
      })
      .then((response) => setPotentialReach(response.count));
  }, [currentParams]);

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/segments" className="text-primary hover:underline">
            Segments
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          {id ? <span>Edit</span> : <span>New</span>}
        </li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel items-center overflow-x-auto whitespace-nowrap p-7 text-primary">
          <label className="mb-3 text-2xl text-primary">
            {' '}
            {id ? <span>Edit </span> : <span>New </span>}
            Zero-Knowledge Proof Request {id ? `#${id}` : ''}
          </label>
          <div className="grid grid-cols-3">
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
              {({ errors, submitCount, touched, values, handleChange }) => (
                <Form className="col-span-2 space-y-5 text-secondary">
                  <div className="grid grid-cols-1 gap-5">
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

                    <div className={submitCount ? (errors.schema ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="operator">Schema</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="schema"
                        name="schema"
                        options={schemas?.map((schema) => {
                          return { label: schema.title, value: schema.bigint };
                        })}
                        onChange={(value) => {
                          setCurrentParams((prevState) => ({ ...prevState, schema: value?.value ?? '0' }));
                          values.schema = value?.value ?? '0';
                        }}
                      />
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

                    <div className={submitCount ? (errors.schema ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="operator">Field</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        noOptionsMessage={() => 'Please select a schema first'}
                        id="schema"
                        name="schema"
                        options={
                          values.schema
                            ? Object.keys(
                                schemas.find((schema) => schema.bigint === values.schema.toString())
                                  ?.credentialSubject || {}
                              )
                                .map((key, index) => {
                                  return { label: key, value: index };
                                })
                                .slice(1)
                            : []
                        }
                        onChange={(value) => {
                          setCurrentParams((prevState) => ({ ...prevState, slotIndex: value?.value ?? 0 }));
                          values.slotIndex = value?.value ?? 0;
                        }}
                      />
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
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <div className={submitCount ? (errors.operator ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="operator">Operator</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="operator"
                        name="operator"
                        options={operatorOptions}
                        onChange={(value) => {
                          setCurrentParams((prevState) => ({ ...prevState, operator: value?.value ?? 1 }));
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
                    <div className={submitCount ? (errors.value ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="value">Value</label>
                      <Field
                        name="value"
                        type="string"
                        id="value"
                        placeholder="Enter value"
                        onChange={(e: any) => {
                          setCurrentParams((prevState) => ({ ...prevState, value: e.target.value }));
                          handleChange(e);
                        }}
                        className="form-input"
                      />
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
                      disabled={processingSegment}
                      className="btn btn-primary !mt-6"
                      onClick={() => {
                        if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                          const parsed = schema.safeParse(values);
                          if (parsed.success) {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            submitForm(parsed.data);
                          }
                        }
                      }}>
                      {processingSegment ? 'Creating Ad...' : 'Create'}
                    </button>
                  ) : (
                    <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
                  )}
                </Form>
              )}
            </Formik>
            <div className="col-span-1">
              <div className="m-7 rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <label className="m-5 mb-0 text-secondary">Potential Reach</label>
                <div className="h-full w-full p-5">
                  <label className="text-center align-middle text-8xl">{potentialReach}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewSegmentPage = () => SegmentEditorComponent();

export default NewSegmentPage;
