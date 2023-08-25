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
import { useGetAllTargetGroupsQuery } from '~~/generated/graphql.types';
import { useWallet } from '~~/hooks';

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
  const { data: targetGroups } = useGetAllTargetGroupsQuery();
  const [creatingAd, setCreatingAd] = useState(false);
  const { writeAsync: createAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'createAd',
  });

  const router = useRouter();
  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    setCreatingAd(true);

    const adMetadata = {
      title: data.title,
      description: data.description,
      image: data.image,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: adMetadata }),
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
      setCreatingAd(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      const createAdResponse = await createAdAsync({
        args: [
          {
            metadataURI,
            budget: data.budget,
            maxImpressionPrice: data.maxImpressionPrice,
            minBlock: data.minBlock,
            maxBlock: data.maxBlock,
            targetGroupIds: data.targetGroupIds,
          },
        ],
        value: BigInt(data.budget),
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

      router.push('/ads');
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

      setCreatingAd(false);
    }
  };

  const schema = z.object({
    title: z.string().describe('Please fill the title'),
    description: z.string().describe('Please fill the description'),
    image: z.string().describe('Please provide an image URL'),
    budget: z.number().describe('Please choose a budget'),
    maxImpressionPrice: z.number().describe('Please provide a max impression price'),
    minBlock: z.number().describe('Please provide a starting block'),
    maxBlock: z.number().describe('Please provide a ending block'),
    targetGroupIds: z.array(z.number()).describe('You must set a list of target groups'),
  });

  type FormValues = z.infer<typeof schema>;

  const targetGroupOptions = targetGroups?.targetGroups.map((tg) => {
    return {
      value: tg.id,
      label: 'TG: ' + tg.id,
    };
  });

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/ads" className="text-primary hover:underline">
            Ads
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
              image: '',
              budget: '',
              maxImpressionPrice: '',
              minBlock: '',
              maxBlock: '',
              targetGroupIds: [] as number[],
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

                  <div className={submitCount ? (errors.image ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="fullName">Image URL </label>
                    <Field name="image" type="text" id="image" placeholder="Enter Image URL" className="form-input" />

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

                  <div className={submitCount ? (errors.budget ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="budget">budget</label>
                    <div className="flex">
                      <div className="flex items-center justify-center border border-white-light bg-[#eee] px-3 font-semibold ltr:rounded-l-md ltr:border-r-0 rtl:rounded-r-md rtl:border-l-0 dark:border-[#17263c] dark:bg-[#1b2e4b]">
                        MATIC
                      </div>
                      <Field
                        name="budget"
                        type="number"
                        id="budget"
                        placeholder="Enter budget"
                        className="form-input ltr:rounded-l-none rtl:rounded-r-none"
                      />
                    </div>
                    {submitCount ? (
                      errors.budget ? (
                        <div className="mt-1 text-danger">{errors.budget}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className={submitCount ? (errors.minBlock ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="minBlock">Starting Block</label>
                    <Field
                      name="minBlock"
                      type="number"
                      id="minBlock"
                      placeholder="Enter min block"
                      className="form-input"
                    />
                    {submitCount ? (
                      errors.minBlock ? (
                        <div className="mt-1 text-danger">{errors.minBlock}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={submitCount ? (errors.maxBlock ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="maxBlock">Ending Block</label>
                    <Field
                      name="maxBlock"
                      type="number"
                      id="maxBlock"
                      placeholder="Enter max block"
                      className="form-input"
                    />
                    {submitCount ? (
                      errors.maxBlock ? (
                        <div className="mt-1 text-danger">{errors.maxBlock}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                  <div className={submitCount ? (errors.maxImpressionPrice ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="maxImpressionPrice">Max Impression Price</label>
                    <Field
                      name="maxImpressionPrice"
                      type="number"
                      id="maxImpressionPrice"
                      placeholder="Enter maxImpressionPrice"
                      className="form-input"
                    />

                    {submitCount ? (
                      errors.maxImpressionPrice ? (
                        <div className="mt-1 text-danger">{errors.maxImpressionPrice}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={submitCount ? (errors.maxBlock ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="targetGroupIds">Target Groups</label>
                    <Select
                      classNames={{
                        control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b]',
                        option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b]',
                      }}
                      placeholder="Select an option"
                      id="targetGroupIds"
                      options={targetGroupOptions}
                      name="targetGroupIds"
                      onChange={(value) => {
                        values.targetGroupIds = value.map((v) => Number(v.value)) ?? [];
                      }}
                      isMulti
                      isSearchable={true}
                    />
                    {submitCount ? (
                      errors.targetGroupIds ? (
                        <div className="mt-1 text-danger">{errors.targetGroupIds}</div>
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
                    disabled={creatingAd}
                    className="btn btn-primary !mt-6"
                    onClick={() => {
                      if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                        const parsed = schema.safeParse(values);
                        if (parsed.success) {
                          submitForm(parsed.data);
                        }
                      }
                    }}>
                    {creatingAd ? 'Creating Ad...' : 'Create'}
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
