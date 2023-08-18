import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import Swal from 'sweetalert2';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import Select from 'react-select';
import { useGetAllTargetGroupsQuery, useGetAllZkpRequestsQuery } from '~~/generated/graphql.types';
import { Divider, Typography } from 'antd';
import { Targecy, Targecy__factory } from '~common/generated/contract-types';
import { useAppContracts } from '~common/components/context';
import { useState } from 'react';
import { UploadMetadataResponse } from '../api/metadata/upload';
import {
  useBalance,
  useConnect,
  useContractEvent,
  useContractRead,
  useContractWrite,
  usePublicClient,
  useWalletClient,
} from 'wagmi';
import { targecyContractAddress } from '~~/constants/contracts.constants';
import { useWallet } from '~~/hooks';
import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { ethers } from 'ethers';

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
  const { data: zkpRequests } = useGetAllZkpRequestsQuery();
  const [creatingTargetGroup, setCreatingTargetGroup] = useState(false);
  const { writeAsync: createTargetGroup } = useContractWrite({
    address: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
    abi: Targecy__factory.abi,
    functionName: 'createTargetGroup',
  });

  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    setCreatingTargetGroup(true);

    const targetGroupMetadata = {
      title: data.title,
      description: data.description,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: targetGroupMetadata }),
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
      setCreatingTargetGroup(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      const createAdResponse = await createTargetGroup({
        args: [metadataURI, data.zkpRequests],
      });
      const toast = Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      });
      toast.fire({
        icon: 'success',
        title: 'Ad created successfully! Tx: ' + createAdResponse.hash,
        padding: '10px 20px',
      });
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
      console.log(e);
    }

    setCreatingTargetGroup(false);
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
      label: 'ZKPRequest: ' + req.id,
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
          <span>New</span>
        </li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel flex items-center overflow-x-auto whitespace-nowrap p-3 text-primary">
          <Formik
            initialValues={{
              title: '',
              description: '',
              zkpRequests: [],
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
                    disabled={creatingTargetGroup}
                    className="btn btn-primary !mt-6"
                    onClick={() => {
                      if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                        const parsed = schema.safeParse(values);
                        if (parsed.success) {
                          submitForm(parsed.data);
                        }
                      }
                    }}>
                    {creatingTargetGroup ? 'Creating Ad...' : 'Create'}
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
