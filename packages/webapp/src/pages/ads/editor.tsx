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
import { useGetAdQuery, useGetAllAudiencesQuery, useGetAllPublishersQuery } from '~~/generated/graphql.types';
import { useWallet } from '~~/hooks';
import { fetchMetadata } from '~~/utils/metadata';
import { backendTrpcClient } from '~~/utils/trpc';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const abi = require('../../generated/abis/Targecy.json');

const attributionOptions = [
  { value: 0, label: 'Impression' },
  { value: 1, label: 'Click' },
  { value: 2, label: 'Conversion' },
];

const activeOptions = [
  { value: true, label: 'Active' },
  { value: false, label: 'Inactive' },
];

const weekdaysOptions = [
  { value: 0, label: 'Monday' },
  { value: 1, label: 'Tuesday' },
  { value: 2, label: 'Wednesday' },
  { value: 3, label: 'Thursday' },
  { value: 4, label: 'Friday' },
  { value: 5, label: 'Saturday' },
  { value: 6, label: 'Sunday' },
];

export const AdEditorComponent = (id?: string) => {
  const editingMode = !!id;
  const { data: audiences } = useGetAllAudiencesQuery();
  const { data: publishers } = useGetAllPublishersQuery();

  const [processingAd, setProcessingAd] = useState(false);
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
    setProcessingAd(true);

    const adMetadataFormData = new FormData();

    adMetadataFormData.append('title', data.title);
    adMetadataFormData.append('description', data.description);
    adMetadataFormData.append('image', data.imageFile);

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: adMetadataFormData,
    });

    if (!metadataUploadResponse.ok) {
      Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: 'Error uploading metadata ' + metadataUploadResponse.statusText,
        padding: '10px 20px',
      });

      setProcessingAd(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      let hash;
      const newAdArgs = {
        // @todo (Martin): Type this based on function's args
        metadataURI,
        attribution: data.attribution,
        active: data.active,
        startingTimestamp: data.startingTimestamp,
        endingTimestamp: data.endingTimestamp,
        audienceIds: data.audienceIds,
        blacklistedPublishers: data.blacklistedPublishers,
        blacklistedWeekdays: data.blacklistedWeekdays,
        budget: data.budget,
        maxPricePerConsumption: data.maxPricePerConsumption,
        maxConsumptionsPerDay: data.maxConsumptionsPerDay,
      };

      if (id) {
        // Edit Ad
        hash = (
          await editAdAsync({
            args: [id, newAdArgs],
            value: BigInt(data.budget),
          })
        ).hash;
      } else {
        // Create Ad
        hash = (
          await createAdAsync({
            args: [newAdArgs],
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
        title: `Ad ${editingMode ? 'edited' : 'created'} successfully! Tx: ${hash}`,
        padding: '10px 20px',
      });

      await router.push('/ads');
    } catch (e) {
      console.error(e);
      Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: `Error ${editingMode ? 'editing' : 'creating'} ad`,
        padding: '10px 20px',
      });

      setProcessingAd(false);
    }
  };

  const schema = z.object({
    title: z.string().describe('Please fill the title'),
    description: z.string().describe('Please fill the description'),
    image: z.string().describe('Please provide an image URL'),
    imageFile: z.any().describe('Please provide an image'),
    attribution: z.number().describe('Please provide an attribution'),
    active: z.boolean().describe('Please provide an active'),
    blacklistedPublishers: z.array(z.string()).describe('Please provide a list of blacklisted publishers'),
    blacklistedWeekdays: z.array(z.number()).describe('Please provide a list of blacklisted weekdays'),
    budget: z.number().describe('Please choose a budget'),
    maxPricePerConsumption: z.number().describe('Please provide a max impression price'),
    maxConsumptionsPerDay: z.number().describe('Please provide a max consumptions per day'),
    startingTimestamp: z.number().describe('Please provide a starting timestamp'),
    endingTimestamp: z.number().describe('Please provide a ending timestamp'),
    audienceIds: z.array(z.number()).describe('You must set a list of audiences'),
  });

  type FormValues = z.infer<typeof schema>;

  const [previewValues, setPreviewValues] = useState<Partial<FormValues>>({});

  const [currentAudiences, setCurrentAudiences] = useState<number[] | undefined>(undefined);
  const [potentialReach, setPotentialReach] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (!currentAudiences || currentAudiences.length === 0) return;

    backendTrpcClient.targets.getAudiencesReach
      .query({
        ids: currentAudiences.map((id) => id.toString()),
      })
      .then((response) => setPotentialReach(response.count))
      .catch((error) => console.error(error));
  }, [currentAudiences]);

  const [audiencesMetadata, setAudiencesMetadata] = useState<Record<string, Awaited<ReturnType<typeof fetchMetadata>>>>(
    {}
  );

  useAsync(async () => {
    if (audiences) {
      const metadata: Record<string, Awaited<ReturnType<typeof fetchMetadata>>> = {};
      for (const a of audiences.audiences) {
        metadata[a.id] = await fetchMetadata(a.metadataURI);
      }

      setAudiencesMetadata(metadata);
    }
  }, [audiences]);

  const audienceOptions = audiences?.audiences.map((a) => {
    return {
      value: a.id,
      label: audiencesMetadata[a.id]?.title ?? `Audience #${a.id}`,
    };
  });

  const publisherOptions = publishers?.publishers.map((p) => {
    return {
      value: p.id,
      label: p.id,
    };
  });

  const [currentAttribution, setCurrentAttribution] = useState<number | undefined>(undefined);
  const [currentActive, setCurrentActive] = useState<boolean | undefined>(undefined);
  const [currentBlacklistedPublishers, setCurrentBlacklistedPublishers] = useState<string[] | undefined>(undefined);
  const [currentBlacklistedWeekdays, setCurrentBlacklistedWeekdays] = useState<number[] | undefined>(undefined);

  const [currentMetadata, setCurrentMetadata] = useState<
    { title?: string; description?: string; image?: string } | undefined
  >(undefined);
  const { data: adData } = useGetAdQuery({ id: id ?? '' });
  const ad = adData?.ad;
  useAsync(async () => {
    if (ad) {
      const initialAudiences = ad?.audiences.map((a) => Number(a.id)) ?? [];
      if ((!currentAudiences || !currentAudiences.length) && initialAudiences.length) {
        setCurrentAudiences(initialAudiences);
      }

      if (currentAttribution === undefined && ad.attribution !== undefined) setCurrentAttribution(ad.attribution);
      if (currentActive === undefined && ad.active !== undefined) setCurrentActive(ad.active);
      if (
        currentBlacklistedPublishers === undefined &&
        ad.blacklistedPublishers !== undefined &&
        ad.blacklistedPublishers.length
      )
        setCurrentBlacklistedPublishers(ad.blacklistedPublishers.map((p) => p.id));
      if (
        currentBlacklistedWeekdays === undefined &&
        ad.blacklistedWeekdays !== undefined &&
        ad.blacklistedWeekdays.length
      )
        setCurrentBlacklistedWeekdays(ad.blacklistedWeekdays);

      const newMetadata = await fetch(`https://${ad.metadataURI}.ipfs.nftstorage.link`);
      const json = await newMetadata.json();
      setCurrentMetadata({ title: json.title, description: json.description, image: json.imageUrl });

      setPreviewValues({
        title: json?.title,
        description: json?.description,
        image: json?.imageUrl,
      });
    }
  }, [ad]);

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/ads" className="text-primary hover:underline">
            Ads
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
            {editingMode ? `'${currentMetadata?.title}'` : 'Campaign'}
          </label>
          <div className="grid grid-cols-2 gap-5">
            <Formik
              enableReinitialize={true}
              initialValues={{
                title: currentMetadata?.title ?? '',
                description: currentMetadata?.description ?? '',
                image: currentMetadata?.image ?? '',
                budget: Number(ad?.remainingBudget),
                maxPricePerConsumption: Number(ad?.maxPricePerConsumption),
                maxConsumptionsPerDay: Number(ad?.maxConsumptionsPerDay),
                startingTimestamp: Number(ad?.startingTimestamp),
                endingTimestamp: Number(ad?.endingTimestamp),
                attribution: Number(ad?.attribution),
                active: Boolean(ad?.active),
                blacklistedPublishers: ad?.blacklistedPublishers.map((p) => p.id) ?? [],
                blacklistedWeekdays: ad?.blacklistedWeekdays ?? [],

                audienceIds: [] as number[],
              }}
              validationSchema={toFormikValidationSchema(schema)}
              onSubmit={() => {}}>
              {({ errors, submitCount, touched, values, handleChange, setFieldValue }) => (
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
                        type="file"
                        id="image"
                        className="form-input"
                        onChange={(e: any) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setPreviewValues((prevState) => ({ ...prevState, image: reader.result as string }));
                            };
                            reader.readAsDataURL(file);

                            setFieldValue('imageFile', file);
                          }
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
                      <label htmlFor="budget">{editingMode ? 'Remaining Budget' : 'Budget'}</label>
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
                          <div className="mt-1 text-danger">{errors.budget.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className={submitCount ? (errors.attribution ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="startingTimestamp">Bidding Strategy</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          multiValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          multiValueLabel: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="attribution"
                        options={attributionOptions}
                        name="attribution"
                        value={attributionOptions?.filter((a) => currentAttribution === Number(a.value)) ?? []}
                        onChange={(value) => {
                          setCurrentAttribution(Number(value?.value) ?? 0);
                          values.attribution = Number(value?.value) ?? 0;
                        }}
                        isSearchable={true}
                      />
                      {submitCount ? (
                        errors.attribution ? (
                          <div className="mt-1 text-danger">{errors.attribution.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>

                    <div className={submitCount ? (errors.active ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="active">Campaign Status</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          multiValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          multiValueLabel: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="active"
                        options={activeOptions}
                        name="active"
                        value={activeOptions?.filter((a) => currentActive === a.value) ?? true}
                        onChange={(value) => {
                          setCurrentActive(value?.value ?? true);
                          values.active = value?.value ?? true;
                        }}
                        isSearchable={true}
                      />
                      {submitCount ? (
                        errors.active ? (
                          <div className="mt-1 text-danger">{errors.active.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className={submitCount ? (errors.startingTimestamp ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="startingTimestamp">Starting Timestamp</label>
                      <Field
                        name="startingTimestamp"
                        type="number"
                        id="startingTimestamp"
                        placeholder="Enter min timestamp"
                        className="form-input"
                      />
                      {submitCount ? (
                        errors.startingTimestamp ? (
                          <div className="mt-1 text-danger">{errors.startingTimestamp.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>

                    <div className={submitCount ? (errors.endingTimestamp ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="endingTimestamp">Ending Timestamp</label>
                      <Field
                        name="endingTimestamp"
                        type="number"
                        id="endingTimestamp"
                        placeholder="Enter max timestamp"
                        className="form-input"
                      />
                      {submitCount ? (
                        errors.endingTimestamp ? (
                          <div className="mt-1 text-danger">{errors.endingTimestamp.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className={submitCount ? (errors.maxPricePerConsumption ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="maxPricePerConsumption">Max Impression Price</label>
                      <Field
                        name="maxPricePerConsumption"
                        type="number"
                        id="maxPricePerConsumption"
                        placeholder="Enter max impression price"
                        className="form-input"
                      />

                      {submitCount ? (
                        errors.maxPricePerConsumption ? (
                          <div className="mt-1 text-danger">{errors.maxPricePerConsumption.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={submitCount ? (errors.maxConsumptionsPerDay ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="maxPricePerConsumption">Max Consumptions per day</label>
                      <Field
                        name="maxConsumptionsPerDay"
                        type="number"
                        id="maxConsumptionsPerDay"
                        placeholder="Enter max consumptions per day"
                        className="form-input"
                      />

                      {submitCount ? (
                        errors.maxConsumptionsPerDay ? (
                          <div className="mt-1 text-danger">{errors.maxConsumptionsPerDay.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className={submitCount ? (errors.blacklistedPublishers ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="startingTimestamp">Placement Exclusion</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          multiValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          multiValueLabel: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="blacklistedPublishers"
                        options={publisherOptions}
                        name="blacklistedPublishers"
                        isMulti
                        value={publisherOptions?.filter((a) => currentBlacklistedPublishers?.includes(a.value)) ?? []}
                        onChange={(value) => {
                          setCurrentBlacklistedPublishers(value.map((v) => v.value));
                          values.blacklistedPublishers = value.map((v) => v.value) ?? [];
                        }}
                        isSearchable={true}
                      />
                      {submitCount ? (
                        errors.blacklistedPublishers ? (
                          <div className="mt-1 text-danger">{errors.blacklistedPublishers.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>

                    <div className={submitCount ? (errors.blacklistedWeekdays ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="active">Blacklisted Weekdays</label>
                      <Select
                        classNames={{
                          control: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          option: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          singleValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                          multiValue: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          multiValueLabel: () =>
                            'bg-white dark:border-[#17263c] dark:bg-secondary text-dark dark:text-white',
                          menu: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="blacklistedWeekdays"
                        options={weekdaysOptions}
                        name="blacklistedWeekdays"
                        value={
                          weekdaysOptions?.filter((a) => currentBlacklistedWeekdays?.includes(Number(a.value))) ?? []
                        }
                        onChange={(value) => {
                          setCurrentBlacklistedWeekdays(value?.map((v) => Number(v.value)) ?? []);
                          values.blacklistedWeekdays = value?.map((v) => Number(v.value)) ?? [];
                        }}
                        isMulti
                        isSearchable={true}
                      />
                      {submitCount ? (
                        errors.active ? (
                          <div className="mt-1 text-danger">{errors.active.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className={submitCount ? (errors.endingTimestamp ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="audienceIds">Audiences</label>
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
                      id="audienceIds"
                      options={audienceOptions}
                      name="audienceIds"
                      value={audienceOptions?.filter((a) => currentAudiences?.includes(Number(a.value))) ?? []}
                      onChange={(value) => {
                        setCurrentAudiences(value.map((v) => Number(v.value)));
                        values.audienceIds = value.map((v) => Number(v.value)) ?? [];
                      }}
                      isMulti
                      isSearchable={true}
                    />
                    {submitCount ? (
                      errors.audienceIds ? (
                        <div className="mt-1 text-danger">{errors.audienceIds}</div>
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
                      disabled={processingAd || Object.keys(touched).length === 0}
                      className={`btn btn-primary !mt-6 `}
                      onClick={() => {
                        if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                          const parsed = schema.safeParse(values);
                          if (parsed.success) {
                            submitForm(parsed.data);
                          } else {
                            console.error(parsed.error);
                          }
                        } else {
                          console.error(errors);
                        }
                      }}>
                      {editingMode && processingAd && 'Editing Ad...'}
                      {editingMode && !processingAd && 'Edit'}
                      {!editingMode && processingAd && 'Creating Ad...'}
                      {!editingMode && !processingAd && 'Create'}
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
              <div
                hidden={potentialReach === undefined}
                className="mb-8 ml-8 mr-8 mt-4 rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
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
