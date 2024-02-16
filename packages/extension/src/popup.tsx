import React from 'react';
import { createRoot } from 'react-dom/client';
import '../tailwind.css';
import { CompassOutlined, PaperClipOutlined, QuestionOutlined, WalletOutlined } from '@ant-design/icons';

const Popup = () => {
  return (
    <>
      <div className="w-full h-full bg-white flex flex-1 flex-col">
        {/* Header */}
        <div className="w-full h-[100px] flex justify-center bg-primary">
          <img className="m-1 w-24 h-24 float-right" src="/logo.png" alt="logo" />
          <div className="h-full flex justify-center items-center text-center">
            <p className="text-4xl text-black font-oxygen">Targecy</p>
          </div>
        </div>
        {/* Body */}
        <div className=" grow">
          <div className="flex h-full justify-center items-center text-center">
            <p className="text-xl text-gray-300 font-oxygen">The extension is issuing credentials correctly.</p>
          </div>
        </div>
        {/* Footer */}
        <div className="w-full h-[100px] flex justify-center bg-primary">
          <div className="h-full flex justify-center gap-10 items-center text-center font-oxygen">
            <a
              href="https://app.targecy.xyz/credentials"
              target="_blank"
              className="hover:text-white transition-all hover:cursor-pointer">
              <WalletOutlined className="text-5xl"></WalletOutlined>
              <p className="text-md">My credentials</p>
            </a>
            <a
              href="https://app.targecy.xyz/discover"
              target="_blank"
              className="hover:text-white transition-all hover:cursor-pointer">
              <CompassOutlined className="text-5xl"></CompassOutlined>
              <p className="text-md">Discover</p>
            </a>
            <a
              href="https://docs.targecy.xyz/getting-started/faqs"
              target="_blank"
              className="hover:text-white transition-all hover:cursor-pointer">
              <QuestionOutlined className="text-5xl"></QuestionOutlined>
              <p className="text-md">About</p>
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
