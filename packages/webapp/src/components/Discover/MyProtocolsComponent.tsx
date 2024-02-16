import {
  ProtocolUsedTargecyCredentialSubject,
  SCHEMA_TYPES,
  TokenHolderTargecyCredentialSubject,
} from '@backend/constants/schemas/schemas.constant';
import { useCredentials, useTargecyContext } from '@targecy/sdk';
import { DataTable, DataTableColumn } from 'mantine-datatable';
import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { useAsync } from 'react-use';
import { z } from 'zod';

import { DiscoverLoading } from '../loaders/DiscoverLoading';

import { ProtocolProperties, TokenProperties, protocolPropertiesSchema, tokenPropertiesSchema } from './utils';

import { trimAddress } from '~/utils';

const MyProtocolsComponent = () => {
  const scrollRef = useRef(null);
  const { context } = useTargecyContext();
  const { credentials } = useCredentials(context);

  const [myProtocols, setMyProtocols] = useState<ProtocolUsedTargecyCredentialSubject[]>([]);
  const [myTokens, setMyTokens] = useState<TokenHolderTargecyCredentialSubject[]>([]);
  const [myProtocolsProperties, setMyProtocolsProperties] = useState<Record<string, ProtocolProperties>>({});
  const [myTokensProperties, setMyTokensProperties] = useState<Record<string, TokenProperties>>({});

  useEffect(() => {
    if (credentials && credentials.length) {
      const myProtocolsAux = credentials
        .filter((c) => c.type.toString() === SCHEMA_TYPES.ProtocolUsedTargecySchema)
        .map((c) => c.credentialSubject as ProtocolUsedTargecyCredentialSubject);

      setMyProtocols(myProtocolsAux);

      const myTokensAux = credentials
        .filter((c) => c.type.toString() === SCHEMA_TYPES.TokenHolderTargecySchema)
        .map((c) => c.credentialSubject as TokenHolderTargecyCredentialSubject);

      setMyTokens(myTokensAux);
    }
  }, [credentials]);

  useAsync(async () => {
    if (myProtocols && myProtocols.length > 0) {
      await Promise.all(
        myProtocols.map(async (protocol) => {
          try {
            const response = await fetch(`https://api.llama.fi/protocol/${protocol.protocol}`);
            if (!response.ok) throw new Error('Error fetching protocol properties');
            const json = await response.json();
            const properties = protocolPropertiesSchema.parse(json);

            setMyProtocolsProperties((prev) => ({ ...prev, [protocol.id]: properties }));
          } catch (error) {
            console.error('Error fetching protocol properties', error);
          }
        })
      );
    }
  }, [myProtocols]);

  useAsync(async () => {
    if (myTokens && myTokens.length > 0) {
      await Promise.all(
        myTokens.map(async (token) => {
          try {
            const response = await fetch(`https://nft.llama.fi/collection/${token.token}`);
            if (!response.ok) throw new Error('Error fetching token properties');

            const json = await response.json();
            const properties = z.array(tokenPropertiesSchema).parse(json);

            // @todo : add properties in case it's plain erc20

            if (properties.length === 0) throw new Error('No properties found');
            if (properties.length > 1) console.warn('Multiple properties found', properties);

            setMyTokensProperties((prev) => ({ ...prev, [token.id]: properties[0] }));
          } catch (error) {
            console.error('Error fetching token properties', error);
          }
        })
      );
    }
  }, [myTokens]);

  console.log('myProtocols', myProtocols, myProtocolsProperties);
  console.log('myTokens', myTokens, myTokensProperties);

  if (!context || !context.userIdentity) return <DiscoverLoading />;

  const protocolsColumns: DataTableColumn<ProtocolUsedTargecyCredentialSubject>[] = [
    {
      title: 'Name',
      accessor: 'protocol',
      render: (record) => <p>{record.protocol}</p>,
    },
    {
      title: 'Chain',
      accessor: 'chain',
      render: (record) => <p>{record.chain}</p>,
    },
    {
      title: 'TVL',
      accessor: 'tvl',
      render: (record) => (
        <p>
          $
          {myProtocolsProperties[record.protocol]?.tvl[
            myProtocolsProperties[record.protocol]?.tvl.length - 1
          ].totalLiquidityUSD.toLocaleString()}
        </p>
      ),
    },
    {
      title: 'Market Cap',
      accessor: 'mcap',
      render: (record) => <p>${myProtocolsProperties[record.protocol]?.mcap.toLocaleString()}</p>,
    },
    {
      title: '24h Change %',
      accessor: 'change',
      render: (record) => (
        <p>
          {(
            (myProtocolsProperties[record.protocol]?.tvl[myProtocolsProperties[record.protocol]?.tvl.length - 1]
              .totalLiquidityUSD /
              myProtocolsProperties[record.protocol]?.tvl[myProtocolsProperties[record.protocol]?.tvl.length - 2]
                .totalLiquidityUSD) *
            100
          ).toFixed(2)}
          %
        </p>
      ),
    },
  ];
  const tokensColumns: DataTableColumn<TokenHolderTargecyCredentialSubject>[] = [
    {
      title: 'Address',
      accessor: 'token',
      render: (record) => <p>{trimAddress(record.token)}</p>,
    },
    {
      title: 'Chain',
      accessor: 'chain',
      render: (record) => <p>{record.chain}</p>,
    },
    {
      title: 'ID',
      accessor: 'id',
      render: (record) => <p>{record.tokenId}</p>,
    },
    {
      title: 'Name',
      accessor: 'mcap',
      render: (record) => <p>{myTokensProperties[record.token]?.name} </p>,
    },
    {
      title: 'Standard',
      accessor: 'change',
      render: (record) => <p>{myTokensProperties[record.token]?.tokenStandard} </p>,
    },
  ];
  // @todo : add money properties in tokens and more interesting fields

  return (
    <>
      <div className="flex h-full w-full flex-row justify-between overflow-y-auto">
        <div className="panel mb-3 w-full overflow-y-auto p-0" ref={scrollRef}>
          <div className="sticky top-0 w-full bg-inherit p-6 ">
            <h5 className="text-lg font-semibold text-black dark:text-white">My Protocols</h5>
            <p className="text-gray-500">
              Protocols you have interacted with based on your
              <Link href="/credentials" target="_blank" className="p-1 font-bold hover:text-primary">
                credentials
              </Link>
            </p>
          </div>
          <div className="max-h-[700px] p-6 ">
            <DataTable
              rowBorderColor="transparent"
              borderColor="grey"
              noRecordsIcon={<div></div>}
              noRecordsText="No protocols found, make sure to get your credentials."
              rowClassName="bg-white dark:bg-black dark:text-white text-black"
              className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
              records={myProtocols || []}
              highlightOnHover={true}
              minHeight={100}
              columns={protocolsColumns}
              idAccessor="id"
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex h-full w-full flex-row justify-between overflow-y-auto">
        <div className="panel mb-3 w-full overflow-y-auto p-0" ref={scrollRef}>
          <div className="sticky top-0 w-full bg-inherit p-6 ">
            <h5 className="text-lg font-semibold text-black dark:text-white">My Tokens</h5>
            <p className="text-gray-500">
              Tokens you hold, based on your
              <Link href="/credentials" target="_blank" className="p-1 font-bold hover:text-primary">
                credentials
              </Link>
            </p>
          </div>
          <div className="max-h-[700px] p-6 ">
            <DataTable
              rowBorderColor="transparent"
              borderColor="grey"
              noRecordsText="No tokens found, make sure to get your credentials."
              noRecordsIcon={<div> </div>}
              rowClassName="bg-white dark:bg-black dark:text-white text-black"
              className="table-hover whitespace-nowrap bg-white p-7 px-2 py-2 dark:bg-black"
              records={myTokens || []}
              highlightOnHover={true}
              minHeight={100}
              columns={tokensColumns}
              idAccessor="id"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProtocolsComponent;
