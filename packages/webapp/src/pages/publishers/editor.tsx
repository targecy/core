import { Field, Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAsync } from 'react-use';
import Swal from 'sweetalert2';
import { useContractWrite } from 'wagmi';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { NoWalletConnected } from '~/components/shared/Wallet/components/NoWalletConnected';
import { targecyContractAddress } from '~/constants/contracts.constants';
import { Targecy__factory } from '~/generated/contract-types';
import { useGetPublisherQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';
import { PublisherMetadata, fetchPublisherMetadata } from '~/utils';

export const PublisherEditorComponent = (id?: string) => {
  const editingMode = !!id;

  const [processingPublisher, setProcessingPublisher] = useState(false);
  const { writeAsync: setPublisherAsync } = useContractWrite({
    address: targecyContractAddress,
    abi: Targecy__factory.abi,
    functionName: 'setPublisher',
  });

  const router = useRouter();

  const { isConnected } = useWallet();

  const submitForm = async (data: FormValues) => {
    setProcessingPublisher(true);

    const percentageStringTo10kPrecision = (percentage: string) => {
      return BigInt(parseFloat(percentage) * 100);
    };

    const publisherMetadata: PublisherMetadata = {
      name: data.name,
      url: data.url,
    };

    const metadataUploadResponse = await fetch('/api/metadata/upload', {
      method: 'POST',
      body: JSON.stringify({ json: publisherData }),
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
      setProcessingPublisher(false);
      return;
    }

    const metadataURI = (await metadataUploadResponse.json()).uri;

    try {
      const hash = await setPublisherAsync({
        args: [
          {
            vault: data.address as `0x${string}`,
            metadataURI,
            userRewardsPercentage: percentageStringTo10kPrecision(data.usersRewardsPercentage),
            cpi: BigInt(data.cpi),
            cpc: BigInt(data.cpc),
            cpa: BigInt(data.cpa),
            active: true,
          },
        ],
      });

      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'success',
        title: `Publisher ${editingMode ? 'edited' : 'created'} successfully! Tx: ${JSON.stringify(hash)} `,
        padding: '10px 20px',
      });

      await router.push('/publishers');
    } catch (e) {
      await Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      }).fire({
        icon: 'error',
        title: `Error ${editingMode ? 'editing' : 'creating'} publisher`,
        padding: '10px 20px',
      });

      setProcessingPublisher(false);
    }
  };

  // eslint-disable-next-line prettier/prettier
  const percentageWithDecimalsRegex = new RegExp('^[0-9]{1,2}(\\.[0-9]{1,2})?$|^100$');
  const schema = z.object({
    name: z.string().min(1).max(50).describe('Please fill the name'),
    url: z.string().url().min(1).max(50).describe('Please fill the url'),
    address: z
      .string()
      .min(1)
      .max(50)
      .describe('Please fill the address')
      .regex(/^0x[a-fA-F0-9]{40}$/),
    usersRewardsPercentage: z
      .string()
      .regex(percentageWithDecimalsRegex)
      .describe('Please fill the usersRewardsPercentage'),
    cpi: z.number().describe('Please fill the value'),
    cpc: z.number().describe('Please fill the value'),
    cpa: z.number().describe('Please fill the value'),
  });

  const { data: publisherData } = useGetPublisherQuery({ id: id ?? '' });
  const publisher = publisherData?.publisher;
  const [publisherMetadata, setPublisherMetadata] = useState<PublisherMetadata | undefined>(undefined);

  useAsync(async () => {
    if (publisher?.metadataURI) {
      const metadata = await fetchPublisherMetadata(publisher.metadataURI);
      setPublisherMetadata(metadata);
    }
  }, [publisher?.metadataURI]);

  type FormValues = z.infer<typeof schema>;

  return (
    <div>
      <ul className="flex space-x-2 rtl:space-x-reverse">
        <li>
          <Link href="/publishers" className="text-primary hover:underline">
            Publishers
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
            {editingMode ? <span>Edit </span> : <span>New </span>}
            {editingMode ? `'${publisher?.id}'` : 'Publisher'}
          </label>
          <div className="grid-cols-3 sm:block md:block lg:grid">
            <Formik
              enableReinitialize={true}
              initialValues={{
                name: publisherMetadata?.name,
                url: publisherMetadata?.url,
                address: publisher?.id,
                cpi: Number(publisher?.cpi),
                cpc: Number(publisher?.cpc),
                cpa: Number(publisher?.cpa),
                usersRewardsPercentage: Number(publisher?.usersRewardsPercentage || 10),
              }}
              validationSchema={toFormikValidationSchema(schema)}
              onSubmit={() => {}}>
              {({ errors, submitCount, touched, values, handleChange }) => (
                <Form className="col-span-2 space-y-5 text-secondary">
                  <div className="grid grid-cols-1 gap-5">
                    <div className={submitCount ? (errors.name ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="name">Name </label>
                      <Field name="name" type="text" id="name" placeholder="Enter name" className="form-input" />

                      {submitCount ? (
                        errors.name ? (
                          <div className="mt-1 text-danger">{errors.name.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>

                    <div className={submitCount ? (errors.url ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="url">URL </label>
                      <Field name="url" type="text" id="url" placeholder="Enter URL" className="form-input" />

                      {submitCount ? (
                        errors.url ? (
                          <div className="mt-1 text-danger">{errors.url.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5">
                    <div className="grid-cols-1 gap-5 sm:block md:block lg:grid">
                      <div className={submitCount ? (errors.address ? 'has-error' : 'has-success') : ''}>
                        <label htmlFor="address">address </label>
                        <Field
                          name="address"
                          type="text"
                          id="address"
                          placeholder="Enter address"
                          className="form-input"
                        />

                        {submitCount ? (
                          errors.address ? (
                            <div className="mt-1 text-danger">{errors.address.toString()}</div>
                          ) : (
                            <div className="mt-1 text-success"></div>
                          )
                        ) : (
                          ''
                        )}
                      </div>

                      <div className={submitCount ? (errors.usersRewardsPercentage ? 'has-error' : 'has-success') : ''}>
                        <label htmlFor="usersRewardsPercentage">Users Rewards Percentage </label>
                        <Field
                          name="usersRewardsPercentage"
                          type="text"
                          id="usersRewardsPercentage"
                          placeholder="Enter usersRewardsPercentage"
                          className="form-input"
                        />

                        {submitCount ? (
                          errors.usersRewardsPercentage ? (
                            <div className="mt-1 text-danger">{errors.usersRewardsPercentage.toString()}</div>
                          ) : (
                            <div className="mt-1 text-success"></div>
                          )
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid-cols-1 gap-5 sm:block md:block md:grid-cols-3 lg:grid">
                    <div className={`${submitCount ? (errors.cpi ? 'has-error' : 'has-success') : ''} col-span-1`}>
                      <label htmlFor="value">CPI</label>
                      <Field
                        name="cpi"
                        type="number"
                        id="cpi"
                        placeholder="Enter cpi"
                        onChange={(e: any) => {
                          handleChange(e);
                        }}
                        className="form-input"
                      />
                      {submitCount ? (
                        errors.cpi ? (
                          <div className="mt-1 text-danger">{errors.cpi.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={`${submitCount ? (errors.cpc ? 'has-error' : 'has-success') : ''} col-span-1`}>
                      <label htmlFor="value">CPC</label>
                      <Field
                        name="cpc"
                        type="number"
                        id="cpc"
                        placeholder="Enter cpc"
                        onChange={(e: any) => {
                          handleChange(e);
                        }}
                        className="form-input"
                      />
                      {submitCount ? (
                        errors.cpc ? (
                          <div className="mt-1 text-danger">{errors.cpc.toString()}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={`${submitCount ? (errors.cpa ? 'has-error' : 'has-success') : ''} col-span-1`}>
                      <label htmlFor="value">CPA</label>
                      <Field
                        name="cpa"
                        type="number"
                        id="cpa"
                        placeholder="Enter cpa"
                        onChange={(e: any) => {
                          handleChange(e);
                        }}
                        className="form-input"
                      />
                      {submitCount ? (
                        errors.cpa ? (
                          <div className="mt-1 text-danger">{errors.cpa.toString()}</div>
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
                      disabled={processingPublisher || Object.keys(touched).length === 0}
                      className="btn btn-primary !mt-6"
                      onClick={() => {
                        if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                          const parsed = schema.safeParse(values);
                          if (parsed.success) {
                            // eslint-disable-next-line @typescript-eslint/no-floating-promises
                            submitForm(parsed.data);
                          } else {
                            console.error(parsed.error);
                          }
                        } else {
                          console.error(errors);
                        }
                      }}>
                      {editingMode && processingPublisher && 'Editing Publisher...'}
                      {editingMode && !processingPublisher && 'Edit'}
                      {!editingMode && processingPublisher && 'Creating Publisher...'}
                      {!editingMode && !processingPublisher && 'Create'}
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
    </div>
  );
};

const NewPublisherPage = () => PublisherEditorComponent();

export default NewPublisherPage;
