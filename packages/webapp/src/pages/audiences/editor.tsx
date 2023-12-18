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
import { Segment, useGetAllSegmentsQuery, useGetAudienceQuery } from '~~/generated/graphql.types';
import { useWallet } from '~~/hooks';
import { fetchMetadata } from '~~/utils/metadata';
import { backendTrpcClient } from '~~/utils/trpc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

export const AudienceEditorComponent = (id?: string) => {
  const { data } = useGetAllSegmentsQuery();
  const segments: Segment[] = data?.segments || [];

  const editingMode = id !== undefined;

  const [processingAudience, setProcessingAudience] = useState(false);
  const { writeAsync: createAudience } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'createAudience',
  });
  const { writeAsync: editAudience } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'editAudience',
  });

  const router = useRouter();
  const { isConnected } = useWallet();

  const [currentMetadata, setCurrentMetadata] = useState<
    { title?: string; description?: string; image?: string } | undefined
  >(undefined);
  const { data: audienceData, isLoading } = useGetAudienceQuery({ id: id ?? '' });
  const audience = audienceData?.audience;
  useAsync(async () => {
    if (audience) {
      const newMetadata = await fetch(`https://${audience.metadataURI}.ipfs.nftstorage.link`);
      const json = await newMetadata.json();
      setCurrentMetadata({ title: json.title, description: json.description });
    }
  }, [audience]);

  const submitForm = async (data: FormValues) => {
    setProcessingAudience(true);

    const audienceMetadata = {
      title: data.title,
      description: data.description,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: audienceMetadata }),
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
      setProcessingAudience(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      let hash;
      if (!editingMode) {
        hash = (
          await createAudience({
            args: [metadataURI, data.segments],
          })
        ).hash;
      } else {
        hash = (
          await editAudience({
            args: [id, metadataURI, data.segments],
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
        title: `Ad ${editingMode ? 'edited' : 'created'} successfully! Tx: ${hash}`,
        padding: '10px 20px',
      });

      await router.push('/audiences');
    } catch (e) {
      console.log(e);
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: `Error ${editingMode ? 'editing' : 'creating'} audience`,
        padding: '10px 20px',
      });

      setProcessingAudience(false);
    }
  };

  const schema = z.object({
    title: z.string().describe('Please fill the title'),
    description: z.string().describe('Please fill the description'),
    segments: z.array(z.number()).describe('You must set a list of segments'),
  });

  type FormValues = z.infer<typeof schema>;
  const [currentSegments, setCurrentSegments] = useState<number[] | undefined>(undefined);
  const [potentialReach, setPotentialReach] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!currentSegments || currentSegments.length === 0) return;

    backendTrpcClient.segment.getSegmentPotentialReachByIds
      .query({
        ids: currentSegments.map((id) => id.toString()),
      })
      .catch((error) => console.log(error))
      .then((response) =>
        setPotentialReach(typeof response === 'object' && 'count' in response ? response.count : undefined)
      );
  }, [currentSegments]);

  const [segmentsMetadata, setSegmentsMetadata] = useState<Record<string, Awaited<ReturnType<typeof fetchMetadata>>>>(
    {}
  );

  useAsync(async () => {
    if (segments) {
      setSegmentsMetadata(
        (
          await Promise.all(
            segments.map(async (s) => {
              const newMetadata = await fetch(`https://${s.metadataURI}.ipfs.nftstorage.link`);
              const json = await newMetadata.json();
              return {
                id: s.id,
                metadata: json,
              };
            })
          )
        ).reduce<typeof segmentsMetadata>((acc, curr) => {
          acc[curr.id] = curr.metadata;
          return acc;
        }, {})
      );
    }
  }, [segments]);

  useEffect(() => {
    const initialAudiences = audience?.segments ? audience?.segments.map((id) => Number(id)) : [];

    if ((!currentSegments || !currentSegments.length) && initialAudiences.length) {
      setCurrentSegments(initialAudiences);
    }
  }, [audience]);

  const segmentsOptions = segments.map((req) => {
    return {
      value: req.id,
      label: segmentsMetadata[req.id]?.title ?? `Segment ${req.id}`,
    };
  });

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/audiences" className="text-primary hover:underline">
            Audiences
          </Link>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
          {editingMode ? <span>Edit</span> : <span>New</span>}
        </li>
      </ul>

      <div className="space-y-8 pt-5">
        <div className="panel items-center overflow-x-auto whitespace-nowrap p-7 text-primary">
          <label className="mb-3 text-2xl text-primary">
            {' '}
            {editingMode ? <span>Edit </span> : <span>New </span>}
            {editingMode ? `'${currentMetadata?.title}'` : 'Audience'}
          </label>

          <div className="grid grid-cols-2 gap-5">
            <Formik
              enableReinitialize={true}
              initialValues={{
                title: currentMetadata?.title ?? '',
                description: currentMetadata?.description ?? '',
                segments: [] as number[],
              }}
              validationSchema={toFormikValidationSchema(schema)}
              onSubmit={() => {}}>
              {({ errors, submitCount, touched, values }) => (
                <Form className="space-y-5 text-secondary">
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
                      as="textarea"
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
                  <div className={submitCount ? (errors.segments ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="segments">Segments</label>
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
                      id="segments"
                      name="segments"
                      onChange={(value) => {
                        setCurrentSegments(value.map((v) => Number(v.value)));
                        values.segments = value.map((v) => Number(v.value)) ?? [];
                      }}
                      options={segmentsOptions}
                      isMulti
                      isSearchable={true}
                    />
                    {submitCount ? (
                      errors.segments ? (
                        <div className="mt-1 text-danger">{errors.segments}</div>
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
                      disabled={processingAudience || Object.keys(touched).length === 0}
                      className="btn btn-primary !mt-6"
                      onClick={() => {
                        if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                          const parsed = schema.safeParse(values);
                          if (parsed.success) {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            submitForm(parsed.data);
                          } else {
                            console.log(parsed.error);
                          }
                        }
                      }}>
                      {editingMode && processingAudience && 'Editing Audience...'}
                      {editingMode && !processingAudience && 'Edit'}
                      {!editingMode && processingAudience && 'Creating Audience...'}
                      {!editingMode && !processingAudience && 'Create'}
                    </button>
                  ) : (
                    <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
                  )}
                </Form>
              )}
            </Formik>

            <div
              hidden={potentialReach === undefined}
              className="m-8 rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
              <label className="m-5 text-secondary">Potential Reach</label>
              <div className="h-full w-full">
                <label className="text-center align-middle text-9xl">{potentialReach}</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NewAudiencePage = () => AudienceEditorComponent();

export default NewAudiencePage;
