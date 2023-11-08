import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { targecyContractAddress } from '~~/constants/contracts.constants';
import { useGetAllZkpRequestsQuery } from '~~/generated/graphql.types';
import { useWallet } from '~~/hooks';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/localhost_Targecy.json');

const TargetGroupForm = (id?: { id: string }) => {
  const { data: zkpRequests } = useGetAllZkpRequestsQuery();

  const [processingTargetGroup, setProcessingTargetGroup] = useState(false);
  const { writeAsync: createTargetGroup } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'createTargetGroup',
  });
  const { writeAsync: editTargetGroup } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'editTargetGroup',
  });

  const router = useRouter();

  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    setProcessingTargetGroup(true);

    const targetGroupMetadata = {
      title: data.title,
      description: data.description,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: targetGroupMetadata }),
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
      setProcessingTargetGroup(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      let hash;
      if (!id?.id) {
        hash = (
          await createTargetGroup({
            args: [metadataURI, data.zkpRequests],
          })
        ).hash;
      } else {
        hash = (
          await editTargetGroup({
            args: [id?.id, metadataURI, data.zkpRequests],
          })
        ).hash;
      }
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'success',
        title: `Ad ${id?.id ? 'edited' : 'created'} successfully! Tx: ${hash}`,
        padding: '10px 20px',
      });

      await router.push('/targetGroups');
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

      setProcessingTargetGroup(false);
    }
  };

  const schema = z.object({
    title: z.string().describe('Please fill the title'),
    description: z.string().describe('Please fill the description'),
    zkpRequests: z.array(z.number()).describe('You must set a list of zkpRequests'),
  });

  type FormValues = z.infer<typeof schema>;

  const zkpRequestsOptions = zkpRequests?.zkprequests.map((req) => {
    return {
      value: req.id,
      label: `ZKPRequest: ${req.id}`,
    };
  });

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/targetGroups" className="text-primary hover:underline">
            Target Groups
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          {id ? <span>Edit</span> : <span>New</span>}
        </li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
          <Formik
            initialValues={{
              title: '',
              description: '',
              zkpRequests: [] as number[],
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

                  <div className={submitCount ? (errors.zkpRequests ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="zkpRequests">ZKP Requests</label>
                    <Select
                      classNames={{
                        control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b]',
                        option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b]',
                      }}
                      placeholder="Select an option"
                      id="zkpRequests"
                      name="zkpRequests"
                      onChange={(value) => {
                        values.zkpRequests = value.map((v) => Number(v.value)) ?? [];
                      }}
                      options={zkpRequestsOptions}
                      isMulti
                      isSearchable={true}
                    />
                    {submitCount ? (
                      errors.zkpRequests ? (
                        <div className="mt-1 text-danger">{errors.zkpRequests}</div>
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
                    disabled={processingTargetGroup}
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
                    {processingTargetGroup ? 'Creating Ad...' : 'Create'}
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

export default TargetGroupForm;
