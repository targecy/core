import { W3CCredential } from '@0xpolygonid/js-sdk';
import { InfoCircleOutlined } from '@ant-design/icons';
import { SCHEMA_TYPES } from '@backend/constants/schemas/schemas.constant';
import { useTargecyContext, useCredentialsStatistics, saveCredentials } from '@targecy/sdk';
import { useCredentialsByType } from '@targecy/sdk/src/hooks/useCredentialsByType';
import { getCountryDataList } from 'countries-list';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import { useSignMessage } from 'wagmi';

import DatePicker from '~/components/DatePicker';
import { CredentialsLoader } from '~/components/loaders/CredentialsLoader';
import { vercelEnv } from '~/constants/app.constants';
import { useWallet } from '~/hooks';
import { getWebappCredentialRequest } from '~/utils';

const interests = [
  'Staking',
  'Lending',
  'DEXes',
  'Bridges',
  'RWA',
  'Derivatives',
  'Cross-Chain',
  'Indexes',
  'Privacy',
  'NFTs',
  'Stablecoins',
  'Gaming',
  'Wallet Tools',
  'Analytics',
] as const;

const Credentials = () => {
  const { context } = useTargecyContext();
  const credentialsByType = useCredentialsByType(context);
  const credentialsStatistics = useCredentialsStatistics(context);
  const { isConnected, address } = useWallet();
  const { signMessageAsync } = useSignMessage();
  const [fetchingCredentials, setFetchingCredentials] = useState(false);
  const [credentialsFetched, setCredentialsFetched] = useState(false);

  const [interestsConfig, setInterestsConfig] = useState<Partial<Record<keyof typeof interests, boolean>>>({});

  useEffect(() => {
    if (credentialsByType) {
      credentialsByType[SCHEMA_TYPES.InterestTargecySchema]?.forEach((credential) => {
        const interest = credential.credentialSubject.interest as keyof typeof interests;
        setInterestsConfig({ ...interestsConfig, [interest]: true });
      });

      credentialsByType[SCHEMA_TYPES.ProfileTargecySchema]?.forEach((credential) => {
        setProfile({
          ...(credential.credentialSubject.country ? { country: credential.credentialSubject.country.toString() } : {}),
          ...(credential.credentialSubject.birthdate
            ? { birthdate: new Date(credential.credentialSubject.birthdate.toString()) }
            : {}),
        });
      });
    }
  }, [credentialsByType]);
  const [savingInterests, setSavingInterests] = useState(false);
  const saveInterests = () => {
    setSavingInterests(true);

    if (!context.zkServices || !context.zkServices?.identityWallet || !context.zkServices?.userIdentity.did) {
      Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      })
        .fire({
          icon: 'error',
          title: 'User identity not found. Please try again.',
          padding: '10px 20px',
        })
        .catch(console.error);
      setSavingInterests(false);
      return;
    }

    const interests = Object.entries(interestsConfig)
      .filter((entry) => entry[1] === true)
      .map((entry) => entry[0]);

    const userDID = context.zkServices.userIdentity.did;
    const issuerDID = context.zkServices.issuerIdentity.did;

    Promise.all(
      interests.map(async (interest) => {
        const request = getWebappCredentialRequest('Interests', userDID, { interest });
        const credentialToSave = await context.zkServices?.identityWallet.issueCredential(issuerDID, request, {
          ipfsGatewayURL: 'https://ipfs.io',
        });

        if (!credentialToSave) {
          await Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
          }).fire({
            icon: 'error',
            title: 'Could not create credential for ' + interest + ' . Please try again.',
            padding: '10px 20px',
          });
          setSavingInterests(false);
          return;
        }

        return credentialToSave;
      })
    )
      .then((credentials) => {
        const toSave = credentials.filter((c) => c !== undefined) as W3CCredential[];
        saveCredentials(toSave, vercelEnv)
          .then(async () => {
            await Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
            }).fire({
              icon: 'success',
              title: 'Interests saved.',
              padding: '10px 20px',
            });
            setSavingInterests(false);
          })
          .catch(async (e) => {
            await Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
            }).fire({
              icon: 'error',
              title: 'Error saving interests . Please try again.',
              padding: '10px 20px',
            });
            setSavingInterests(false);
            console.error(e);
          });
      })
      .catch(async (e) => {
        await Swal.mixin({
          toast: true,
          position: 'top',
          showConfirmButton: false,
          timer: 3000,
        }).fire({
          icon: 'error',
          title: 'Error saving interests. Please try again.',
          padding: '10px 20px',
        });
        setSavingInterests(false);
        console.error(e);
      });
  };

  const countriesOptions = getCountryDataList().map((country) => ({
    value: country.name,
    label: country.name,
  }));

  type Profile = {
    country?: string;
    birthdate?: Date;
  };

  const [profile, setProfile] = useState<Profile>({});

  const [savingProfile, setSavingProfile] = useState(false);
  const saveProfile = () => {
    setSavingProfile(true);

    console.log(profile);

    if (!context.zkServices || !context.zkServices?.identityWallet || !context.zkServices?.userIdentity.did) {
      Swal.mixin({
        toast: true,
        position: 'top',
        showConfirmButton: false,
        timer: 3000,
      })
        .fire({
          icon: 'error',
          title: 'User identity not found. Please try again.',
          padding: '10px 20px',
        })
        .catch(console.error);
      setSavingProfile(false);
      return;
    }

    const userDID = context.zkServices.userIdentity.did;
    const issuerDID = context.zkServices.issuerIdentity.did;

    const request = getWebappCredentialRequest('Profile', userDID, {
      birthdate: profile.birthdate?.toISOString(),
      country: profile.country,
    });

    context.zkServices?.identityWallet
      .issueCredential(issuerDID, request, {
        ipfsGatewayURL: 'https://ipfs.io',
      })
      .then(async (credentialToSave) => {
        if (!credentialToSave) {
          await Swal.mixin({
            toast: true,
            position: 'top',
            showConfirmButton: false,
            timer: 3000,
          }).fire({
            icon: 'error',
            title: 'Could not create credential for profile . Please try again.',
            padding: '10px 20px',
          });
          setSavingProfile(false);
          return;
        }

        saveCredentials([credentialToSave], vercelEnv)
          .then(async () => {
            await Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
            }).fire({
              icon: 'success',
              title: 'Profile saved.',
              padding: '10px 20px',
            });
            setSavingProfile(false);
          })
          .catch(async (e) => {
            await Swal.mixin({
              toast: true,
              position: 'top',
              showConfirmButton: false,
              timer: 3000,
            }).fire({
              icon: 'error',
              title: 'Error saving profile . Please try again.',
              padding: '10px 20px',
            });
            setSavingProfile(false);
            console.error(e);
          });
      });

    setSavingProfile(false);
  };

  return (
    <>
      <dialog id="credentialsModal" className="modal">
        <div className="modal-box w-11/12 max-w-5xl rounded-md">
          <div className="">
            <div className="flex items-center justify-between">
              <h5 className="text-xl font-semibold text-primary">My Credentials</h5>
            </div>
            <div className="mb-3 w-fit ">
              <span className="flex h-full justify-center align-middle">
                <Link
                  href="https://docs.targecy.xyz/enthusiasts/privacy-first-user-experience"
                  target="_blank"
                  className="cursor-pointer hover:text-primary">
                  <InfoCircleOutlined className="mb-1 mt-1 align-middle"></InfoCircleOutlined>{' '}
                  <span className="align-middle">Where is all this data stored? </span>
                </Link>{' '}
              </span>
            </div>
          </div>

          <div className="text-md flex justify-between gap-10">
            <span className="">
              Public-data Credentials: <span className="ml-2 text-primary">{credentialsStatistics.public}</span>
            </span>
            <span>
              Behaviour Credentials: <span className="ml-2 text-primary">{credentialsStatistics.behaviour}</span>
            </span>

            <span>
              Private-data Credentials: <span className="ml-2 text-primary">{credentialsStatistics.private}</span>
            </span>

            <span>
              System Credentials: <span className="ml-2 text-primary">{credentialsStatistics.configuration}</span>
            </span>
            <span>
              Total Credentials: <span className="ml-2 text-primary">{credentialsStatistics.total}</span>
            </span>
          </div>
          <div className="min-w-[600px]">
            <div className="w-full">
              {/* Identity Credential */}

              {/* Misc credentials */}
              {Object.keys(credentialsByType).map((type) => (
                <div key={type} className="mb-2 mt-6 w-full">
                  <label key={type} className="break-words text-lg font-semibold text-secondary sm:text-sm">
                    {type}
                  </label>
                  {credentialsByType[type].map((credential) => (
                    <div
                      key={credential.id}
                      className=" mb-4 mt-2 rounded border border-white-light bg-white shadow-[4px_6px_10px_-3px_#bfc9d4] dark:border-[#1b2e4b] dark:bg-[#191e3a] dark:shadow-none">
                      <div className="w-full px-6 py-7">
                        <h5 className="mb-4 break-words text-xl font-semibold ">
                          {credential.type.filter((type: string) => type !== 'VerifiableCredential')}
                        </h5>
                        <p className="text-wrap break-words text-white-dark">
                          <b>Issuer:</b> {credential.issuer}
                        </p>
                        {credential.expirationDate ? (
                          <p className="text-wrap break-words text-white-dark">
                            Expiration: {new Date(credential.expirationDate).toUTCString() || 'None'}
                          </p>
                        ) : null}

                        {Object.entries(credential.credentialSubject)
                          .filter((entry: any[2]) => entry[0] !== 'id' && entry[0] !== 'type')
                          .map((entry: any[2]) => (
                            <p key={entry[0]} className="text-wrap break-words text-white-dark">
                              <b>{entry[0]}</b>: {entry[1].toString()}
                            </p>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              {!credentialsStatistics.total && !credentialsFetched && (
                <label className="mt-4">
                  You have not fetched any credentials yet. Please click on the button above to fetch your credentials.
                </label>
              )}
              {!credentialsStatistics.total && credentialsFetched && (
                <label className="mt-4">
                  We could not find any credentials for this wallet. Please try again in the future or request us for
                  specific credentials.
                </label>
              )}
            </div>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="mb-8 w-full gap-8 sm:grid-cols-2 md:grid-cols-2 lg:grid lg:grid-cols-2">
        {context.userIdentity ? (
          <div className="panel h-full w-full sm:col-span-2 md:col-span-2 lg:col-span-1">
            <div className="mb-2  dark:text-white-light">
              <h5 className="text-lg font-semibold text-primary">Profile</h5>
              <div className="mb-3 w-fit ">
                <span className="flex h-full justify-center align-middle">
                  <Link
                    href="https://docs.targecy.xyz/enthusiasts/privacy-first-user-experience"
                    target="_blank"
                    className="cursor-pointer hover:text-primary">
                    <InfoCircleOutlined className="mb-1 mt-1 align-middle"></InfoCircleOutlined>{' '}
                    <span className="align-middle">Where is all this data stored? </span>
                  </Link>{' '}
                </span>
              </div>
            </div>
            <div className=" text-sm font-bold text-[#515365]">
              <Formik
                enableReinitialize={true}
                initialValues={{}}
                // validationSchema={toFormikValidationSchema(schema)}
                onSubmit={() => {}}>
                {({ errors, submitCount, touched, values, handleChange, setFieldValue }) => (
                  <Form className="grid grid-cols-2 gap-4 text-secondary">
                    {/* Country */}
                    <div className="m-0 p-1">
                      <label htmlFor="audienceIds">Country</label>
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
                          // input: () => 'bg-white dark:border-[#17263c] dark:bg-[#1b2e4b] text-black dark:text-white',
                        }}
                        placeholder="Select an option"
                        id="country"
                        options={countriesOptions}
                        name="audienceIds"
                        value={
                          profile?.country ? { value: profile.country, label: profile.country } : (undefined as any)
                        }
                        onChange={(value) => {
                          setProfile({ ...profile, country: value?.value });
                        }}
                        isSearchable={true}
                      />
                    </div>

                    {/* Birthdate */}
                    <div className="m-0 p-1">
                      <label htmlFor="startingDate">Birthdate</label>
                      <DatePicker
                        name="birthdate"
                        id="birthdate"
                        placeholderText="Enter birthdate"
                        className="form-input"
                        todayButton="Today"
                        dateFormat="MMMM d, yyyy"
                        showTimeInput={false}
                        value={profile?.birthdate?.toISOString() || undefined}
                        onSelect={(date) => {
                          setProfile({ ...profile, birthdate: date });
                        }}
                      />
                    </div>

                    <div className="w-full p-2">
                      <button
                        className={`btn-outline-primary btn w-full ${savingProfile ? 'disabled' : ''} `}
                        disabled={savingProfile || !context.userIdentity}
                        onClick={() => saveProfile()}>
                        {savingProfile ? 'Saving...' : 'Save Profile'}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        ) : (
          <CredentialsLoader />
        )}
        {context.userIdentity ? (
          <div className="panel h-full w-full sm:col-span-2 md:col-span-2 lg:col-span-1">
            <div className="mb-2  dark:text-white-light">
              <h5 className="text-lg font-semibold text-primary">Your Targecy Identity</h5>
              <span>This anonym autogenerated identity is linked to all your credentials on your device.</span>
            </div>
            <div className="w-full text-sm font-bold text-[#515365] sm:grid-cols-2">
              <div>
                <div>
                  <div>Type</div>
                  <p className="text-wrap break-words text-dark dark:text-white-light md:text-sm lg:text-lg">
                    {context.userIdentity?.credential.type}
                  </p>
                </div>
                <div>
                  <div>DID</div>
                  <p className="text-wrap break-words text-dark dark:text-white-light md:text-sm lg:text-lg">
                    {context.userIdentity?.did.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <CredentialsLoader />
        )}
      </div>
      <div className="panel">
        {context.userIdentity ? (
          <>
            {/* Header */}
            <div className="mb-1 flex items-center justify-between">
              <h5 className="text-2xl font-semibold text-primary">My Interests Hub</h5>
            </div>
            <span
              onClick={() => document && (document.getElementById('credentialsModal') as HTMLDialogElement).showModal()}
              className="text-gray mr-2 transition-all hover:cursor-pointer hover:text-primary">
              Manage my credentials
            </span>

            <div className="mt-4">
              <div className="grid grid-cols-4 gap-4">
                {interests.map((interest) => (
                  <div key={interest} className=" w-[200px] rounded-lg  rounded-sm  pb-1 pl-4 pr-4  pt-2">
                    <label className="label flex cursor-pointer justify-between">
                      <span className="label-text p-0">{interest}</span>
                      <input
                        type="checkbox"
                        className="toggle"
                        checked={interestsConfig[interest as any]}
                        onChange={(e) =>
                          setInterestsConfig({ ...interestsConfig, [interest as any]: e.target.checked })
                        }
                      />
                    </label>
                  </div>
                ))}
                <div className="w-full p-4">
                  <button
                    className={`btn-outline-primary btn w-[200px] ${savingInterests ? 'disabled' : ''} `}
                    disabled={savingInterests || !context.userIdentity}
                    onClick={() => saveInterests()}>
                    {savingInterests ? 'Saving...' : 'Save Interests'}
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <CredentialsLoader />
        )}
      </div>
    </>
  );
};

export default Credentials;
