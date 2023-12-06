/* eslint-disable @typescript-eslint/no-floating-promises */
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

import { NoWalletConnected } from '~~/components/shared/Wallet/components/NoWalletConnected';
import { targecyContractAddress } from '~~/constants/contracts.constants';
import { useGetAllTargetGroupsQuery } from '~~/generated/graphql.types';
import { useWallet } from '~~/hooks';
import { fetchMetadata } from '~~/utils/metadata';
import { backendTrpcClient } from '~~/utils/trpc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

export const AdEditorComponent = (id?: string) => {
  const { data: targetGroups } = useGetAllTargetGroupsQuery();
  const [procesingAd, setProcesingAd] = useState(false);
  const { writeAsync: createAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'createAd',
  });
  const { writeAsync: editAdAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'editAd',
  });

  const router = useRouter();
  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    setProcesingAd(true);

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
      }).fire({
        icon: 'error',
        title: 'Error uploading metadata ' + metadataUploadResponse.statusText,
        padding: '10px 20px',
      });
      setProcesingAd(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      let hash;
      if (id) {
        // Edit Ad
        hash = (
          await editAdAsync({
            args: [
              id,
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
          })
        ).hash;
      } else {
        // Create Ad
        hash = (
          await createAdAsync({
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
          })
        ).hash;
      }
      Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'success',
        title: `Ad ${id ? 'edited' : 'created'} successfully! Tx: ${hash}`,
        padding: '10px 20px',
      });

      await router.push('/ads');
    } catch (e) {
      Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: `Error ${id ? 'editing' : 'creating'} ad`,
        padding: '10px 20px',
      });

      setProcesingAd(false);
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

  const [previewValues, setPreviewValues] = useState<Partial<FormValues>>({});

  const [currentTargetGroups, setCurrentTargetGroups] = useState<number[] | undefined>(undefined);
  const [potentialReach, setPotentialReach] = useState<number>(0);
  useEffect(() => {
    if (!currentTargetGroups || currentTargetGroups.length === 0) return;

    backendTrpcClient.targets.getTargetGroupsReach
      .query({
        ids: currentTargetGroups.map((id) => id.toString()),
      })
      .then((response) => setPotentialReach(response.count))
      .catch((error) => console.log(error));
  }, [currentTargetGroups]);

  const { query } = useRouter();
  const [defaultTargetGroupsOptions, setDefaultTargetGroupsOptions] = useState<any[] | undefined>(undefined);
  useEffect(() => {
    const initialTargetGroups = query.targetGroups
      ? query.targetGroups
          .toString()
          .split(',')
          .map((id) => Number(id))
      : [];

    if ((!currentTargetGroups || !currentTargetGroups.length) && initialTargetGroups.length) {
      setCurrentTargetGroups(initialTargetGroups);
      setDefaultTargetGroupsOptions(targetGroupOptions?.filter((tg) => initialTargetGroups.includes(Number(tg.value))));
    }
  }, [query, defaultTargetGroupsOptions]);

  const [targetGroupsMetadata, setTargetGroupsMetadata] = useState<
    Record<string, Awaited<ReturnType<typeof fetchMetadata>>>
  >({});

  useAsync(async () => {
    if (targetGroups) {
      const metadata: Record<string, Awaited<ReturnType<typeof fetchMetadata>>> = {};
      for (const tg of targetGroups.targetGroups) {
        metadata[tg.id] = await fetchMetadata(tg.metadataURI);
      }

      setTargetGroupsMetadata(metadata);
    }
  }, [targetGroups]);

  const targetGroupOptions = targetGroups?.targetGroups.map((tg) => {
    return {
      value: tg.id,
      label: targetGroupsMetadata[tg.id]?.title ?? `Target Group #${tg.id}`,
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
          {id ? <span>Edit</span> : <span>New</span>}
        </li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel items-center overflow-x-auto whitespace-nowrap p-7 text-primary">
          <label className="mb-3 text-2xl text-primary">
            {' '}
            {id ? <span>Edit </span> : <span>New </span>}
            Campaign {id ? `#${id}` : ''}
          </label>
          <div className="grid grid-cols-2 gap-5">
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
              {({ errors, submitCount, touched, values, handleChange }) => (
                <Form className="space-y-5 text-secondary">
                  <div className={submitCount ? (errors.title ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="title">Title </label>
                    <Field
                      name="title"
                      type="text"
                      id="title"
                      placeholder="Enter Title"
                      className="form-input"
                      onChange={(e: any) => {
                        setPreviewValues((prevState) => ({ ...prevState, title: e.target.value }));
                        handleChange(e);
                      }}
                    />
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
                      as="textarea"
                      id="description"
                      placeholder="Enter Description"
                      className="form-input"
                      onChange={(e: any) => {
                        setPreviewValues((prevState) => ({ ...prevState, description: e.target.value }));
                        handleChange(e);
                      }}
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
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className={submitCount ? (errors.image ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="fullName">Image URL </label>
                      <Field
                        name="image"
                        type="text"
                        id="image"
                        placeholder="Enter Image URL"
                        className="form-input"
                        onChange={(e: any) => {
                          setPreviewValues((prevState) => ({ ...prevState, image: e.target.value }));
                          handleChange(e);
                        }}
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
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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
                  </div>
                  <div className={submitCount ? (errors.maxBlock ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="targetGroupIds">Target Groups</label>
                    <Select
                      classNames={{
                        control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        singleValue: () =>
                          'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        multiValue: () => 'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                        multiValueLabel: () =>
                          'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                        menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                      }}
                      placeholder="Select an option"
                      id="targetGroupIds"
                      options={targetGroupOptions}
                      name="targetGroupIds"
                      value={targetGroupOptions?.filter((tg) => currentTargetGroups?.includes(Number(tg.value))) ?? []}
                      onChange={(value) => {
                        setCurrentTargetGroups(value.map((v) => Number(v.value)));
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

                  {isConnected ? (
                    <button
                      type="submit"
                      disabled={procesingAd}
                      className="btn btn-primary !mt-6"
                      onClick={() => {
                        if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                          const parsed = schema.safeParse(values);
                          if (parsed.success) {
                            submitForm(parsed.data);
                          }
                        }
                      }}>
                      {id ? (procesingAd ? 'Editing Ad...' : 'Edit') : procesingAd ? 'Creating Ad...' : 'Create'}
                    </button>
                  ) : (
                    <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
                  )}
                </Form>
              )}
            </Formik>
            <div className="flex flex-col ">
              {/* Preview  */}
              <label className="ml-8 mr-8 mt-8 text-2xl text-secondary">Preview </label>
              <div className="mb-4 ml-8 mr-8 mt-4">
                <div className="card flex flex-row items-center rounded border border-white-light bg-white p-2 shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                  <div className="h-40 w-40 overflow-hidden rounded">
                    <img
                      className="h-full w-full object-scale-down"
                      src={
                        previewValues.image || 'https://www.topnotchegypt.com/wp-content/uploads/2020/11/no-image.jpg'
                      }
                    />
                  </div>
                  <div className="card-body m-2">
                    <h1 className="card-title">{previewValues.title || 'Title'}</h1>
                    <p>{previewValues.description || 'Description'}</p>
                  </div>
                </div>
              </div>
              <div className="mb-8 ml-8 mr-8 mt-4 rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                <label className="float-left m-5 text-2xl text-secondary">Potential Reach</label>
                <label className="float-right m-5 text-2xl text-primary">{potentialReach}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewAdPage = () => {
  return AdEditorComponent();
};

export default NewAdPage;
