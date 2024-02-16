import React from 'react';
import { createRoot } from 'react-dom/client';
import '../tailwind.css';
import { CompassOutlined, QuestionOutlined, WalletOutlined } from '@ant-design/icons';

const Popup = () => {
  return (
    <>
      <div className="w-full h-full bg-[#060818] flex flex-1 flex-col">
        {/* Header */}
        <div className="w-full h-[80px] flex justify-center bg-[#0E1726]">
          <img className="h-full p-2 float-right" src="/logo.png" alt="logo" />
          <div className="h-full flex justify-center items-center text-center">
            <p className="text-2xl text-[#DFE5EB] font-oxygen">Targecy</p>
          </div>
        </div>
        {/* Body */}
        <div className=" grow">
          <div className="flex h-full justify-center items-center text-center">
            <p className="text-xl text-[#DFE5EB] font-oxygen">The extension is issuing credentials correctly.</p>
          </div>
        </div>
        {/* Footer */}
        <div className="w-full h-[75px] flex justify-center bg-[#0E1726]">
          <div className="h-full flex justify-center gap-10 items-center text-center font-oxygen text-[#DFE5EB]">
            <a
              href="https://app.targecy.xyz/credentials"
              target="_blank"
              className="hover:text-primary transition-all hover:cursor-pointer">
              <WalletOutlined className="text-4xl"></WalletOutlined>
              <p className="text-sm">Credentials</p>
            </a>
            <a
              href="https://app.targecy.xyz/discover"
              target="_blank"
              className="hover:text-primary transition-all hover:cursor-pointer">
              <CompassOutlined className="text-4xl"></CompassOutlined>
              <p className="text-sm">Discover</p>
            </a>
            <a
              href="https://docs.targecy.xyz/getting-started/faqs"
              target="_blank"
              className="hover:text-primary transition-all hover:cursor-pointer">
              <QuestionOutlined className="text-4xl"></QuestionOutlined>
              <p className="text-sm">About</p>
            </a>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>
);
