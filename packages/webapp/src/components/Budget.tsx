import { Field, Form, Formik } from 'formik';
import { useState } from 'react';
import Select from 'react-select';
import { useContractWrite, useContractRead, erc20ABI, usePublicClient } from 'wagmi';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { NoWalletConnected } from './shared/Wallet/components/NoWalletConnected';

import { addressZero, targecyContractAddress } from '~/constants/contracts.constants';
import abi from '~/generated/abis/Targecy.json';
import { useGetBudgetQuery } from '~/generated/graphql.types';
import { useWallet } from '~/hooks';

export const Budget = () => {
  const { address } = useWallet();

  const { isConnected } = useWallet();
  const publicClient = usePublicClient();

  const { data, isLoading } = useGetBudgetQuery({
    id: address || '',
  });

  const schema = z.object({
    isDeposit: z.boolean(),
    address: z.string(),
    value: z.number(),
  });
  type FormValues = z.infer<typeof schema>;

  const erc20AddressResponse = useContractRead({
    abi,
    address: targecyContractAddress,
    functionName: 'erc20',
  });
  const erc20Address = (
    erc20AddressResponse.isFetched ? erc20AddressResponse.data?.toString() : addressZero
  ) as `0x${string}`;
  const { writeAsync: approveAsync } = useContractWrite({
    address: erc20Address,
    abi: erc20ABI,
    functionName: 'approve',
  });
  const { writeAsync: fundAdvertiserBudgetAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'fundAdvertiserBudget',
  });

  const { writeAsync: withdrawAdvertiserBudgetAsync } = useContractWrite({
    address: targecyContractAddress,
    abi,
    functionName: 'withdrawAdvertiserBudget',
  });
  const [processing, setProcessing] = useState(false);
  const handleSubmit = async (values: FormValues) => {
    setProcessing(true);

    if (values.isDeposit) {
      try {
        // Approve USDC transfer
        const approveResponse = await approveAsync({
          args: [targecyContractAddress, BigInt(values.value)],
        });
        const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveResponse.hash });

        // Deposit
        const fundResponse = await fundAdvertiserBudgetAsync({
          args: [values.address, values.value],
        });
        const fundReceipt = await publicClient.waitForTransactionReceipt({ hash: fundResponse.hash });

      } catch (error) {
        console.error(error);
      }
    } else {
      // Withdraw
      const withdrawResponse = await withdrawAdvertiserBudgetAsync({
        args: [values.value],
      });
      const withdrawReceipt = await publicClient.waitForTransactionReceipt({ hash: withdrawResponse.hash });
    }

    setProcessing(false);
  };

  return (
    <>
      <dialog id="budgetModal" className="modal">
        <div className="modal-box">
          <div>
            <Formik
              enableReinitialize={true}
              initialValues={{
                isDeposit: true,
                address,
                value: 0n,
              }}
              validationSchema={toFormikValidationSchema(schema)}
              onSubmit={() => {}}>
              {({ errors, submitCount, touched, values }) => (
                <Form className="space-y-5 text-secondary">
                  <div className={submitCount ? (errors.isDeposit ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="isDeposit">Want to deposit or withdraw funds?</label>
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
                      id="segmisDepositents"
                      name="isDeposit"
                      onChange={(value) => {
                        values.isDeposit = Boolean(value?.value);
                      }}
                      options={[
                        { value: true, label: 'Deposit' },
                        {
                          value: false,
                          label: 'Withdraw',
                        },
                      ]}
                    />
                    {submitCount ? (
                      errors.isDeposit ? (
                        <div className="mt-1 text-danger">{errors.isDeposit}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={submitCount ? (errors.address ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="address">Address </label>
                    <Field
                      name="address"
                      type="text"
                      id="address"
                      placeholder="Enter Address"
                      disabled={!values.isDeposit}
                      className="form-input"
                    />

                    {submitCount ? (
                      errors.address ? (
                        <div className="mt-1 text-danger">{errors.address}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>

                  <div className={submitCount ? (errors.value ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="value">Value </label>
                    <Field name="value" type="number" id="value" placeholder="Enter Value" className="form-input" />

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

                  {isConnected ? (
                    <button
                      type="submit"
                      // disabled={processing || Object.keys(touched).length === 0}
                      className="btn btn-primary !mt-6"
                      onClick={() => {
                        if (Object.keys(touched).length !== 0 && Object.keys(errors).length === 0) {
                          const parsed = schema.safeParse(values);
                          if (parsed.success) {
                            handleSubmit(parsed.data).catch(console.error);
                          } else {
                            console.error(parsed.error);
                          }
                        }
                      }}>
                      {values.isDeposit && processing && 'Desposit in progress...'}
                      {values.isDeposit && !processing && 'Deposit'}
                      {!values.isDeposit && processing && 'Withdraw in progress...'}
                      {!values.isDeposit && !processing && 'Withdraw'}
                    </button>
                  ) : (
                    <NoWalletConnected caption="Please connect Wallet"></NoWalletConnected>
                  )}

                  {values.isDeposit && (
                    <span className="mt-3">Deposits will trigger an approval transaction for USDC contract first.</span>
                  )}
                </Form>
              )}
            </Formik>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <span
        onClick={() => document && (document.getElementById('budgetModal') as HTMLDialogElement).showModal()}
        className="text-gray mr-2 transition-all hover:cursor-pointer hover:text-primary">
        ${isLoading ? '...' : data?.budget?.remainingBudget || 0}
      </span>
    </>
  );
};
