// import { useConfig } from 'wagmi';

import { CopyOutlined } from '@ant-design/icons';
import { Ad, AdParams } from '@targecy/sdk';
import { ethers } from 'ethers';
import { Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { toFormikValidationSchema } from 'zod-formik-adapter';

import { env } from '~~/env.mjs';

const schema = z.object({
  width: z.string().describe('Please fill the width'),
  height: z.string().describe('Please fill the height'),
  backgroundColor: z.string().describe('Please fill the background color'),
  titleColor: z.string().describe('Please fill the title color'),
  subtitleColor: z.string().describe('Please fill the subtitle color'),
  borderRadius: z.string().describe('Please fill the border radius'),
  boxShadow: z.string().describe('Please fill the box shadow'),
  border: z.string().describe('Please fill the border'),
  publisher: z.string(),
});

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).catch((err) => console.error(err));
};

const getCode = (params: AdParams) =>
  `<Ad publisher="${params.publisher}" ${
    params?.styling && Object.keys(params.styling).length > 0
      ? `\n          styling={{${Object.entries(params.styling)
          .map(([key, value]) => `\n              ${key}: '${value}'`)
          .join(',')}\n          }}\n      `
      : ''
  }/>    `;

const Demo = () => {
  const [params, setParams] = useState<AdParams>({
    publisher: ethers.constants.AddressZero,
  });
  const [code, setCode] = useState<string>('');

  useEffect(() => {
    setCode(getCode(params));
  }, []);

  return (
    <div className="space-y-8">
      <div className="panel  min-h-[40em] items-center overflow-x-auto whitespace-nowrap p-7 text-primary">
        <label className="mb-3 text-2xl text-primary"> Customize your ad space</label>
        <div className="grid grid-cols-2 gap-5">
          <div className="col-span-1">
            <Formik
              initialValues={{
                width: params.styling?.width,
                height: params.styling?.height,
                backgroundColor: params.styling?.backgroundColor,
                titleColor: params.styling?.titleColor,
                subtitleColor: params.styling?.subtitleColor,
                borderRadius: params.styling?.borderRadius,
                boxShadow: params.styling?.boxShadow,
                border: params.styling?.border,
                publisher: ethers.constants.AddressZero,
              }}
              validationSchema={toFormikValidationSchema(schema)}
              onSubmit={() => {}}>
              {({ errors, submitCount, handleChange, validateField }) => (
                <Form className="space-y-5 text-secondary">
                  <div className="grid grid-cols-2 gap-10">
                    <div className={submitCount ? (errors.width ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="width">Width </label>
                      <Field
                        validate={validateField}
                        name="width"
                        type="text"
                        id="width"
                        placeholder="Enter Width"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.width = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.width ? (
                          <div className="mt-1 text-danger">{errors.width}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={submitCount ? (errors.height ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="height">Height </label>
                      <Field
                        name="height"
                        type="input"
                        id="height"
                        placeholder="Enter Height"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.height = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.height ? (
                          <div className="mt-1 text-danger">{errors.height}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className={submitCount ? (errors.width ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="backgroundColor">Background Color</label>
                      <Field
                        validate={validateField}
                        name="backgroundColor"
                        type="text"
                        id="backgroundColor"
                        placeholder="Enter Width"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.backgroundColor = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.backgroundColor ? (
                          <div className="mt-1 text-danger">{errors.backgroundColor}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={submitCount ? (errors.borderRadius ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="borderRadius">Border Radius </label>
                      <Field
                        name="borderRadius"
                        type="input"
                        id="borderRadius"
                        placeholder="Enter Border Radius"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.borderRadius = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.borderRadius ? (
                          <div className="mt-1 text-danger">{errors.borderRadius}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className={submitCount ? (errors.titleColor ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="titleColor">Title Color</label>
                      <Field
                        validate={validateField}
                        name="titleColor"
                        type="text"
                        id="titleColor"
                        placeholder="Enter Title Color"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.titleColor = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.titleColor ? (
                          <div className="mt-1 text-danger">{errors.titleColor}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={submitCount ? (errors.subtitleColor ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="subtitleColor">Subtitle Color </label>
                      <Field
                        name="subtitleColor"
                        type="input"
                        id="subtitleColor"
                        placeholder="Enter Subtitle Color"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.subtitleColor = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.subtitleColor ? (
                          <div className="mt-1 text-danger">{errors.subtitleColor}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-10">
                    <div className={submitCount ? (errors.boxShadow ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="titleColor">Box Shadow</label>
                      <Field
                        validate={validateField}
                        name="boxShadow"
                        type="text"
                        id="boxShadow"
                        placeholder="Enter Box Shadow"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.boxShadow = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.boxShadow ? (
                          <div className="mt-1 text-danger">{errors.boxShadow}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                    <div className={submitCount ? (errors.border ? 'has-error' : 'has-success') : ''}>
                      <label htmlFor="border">Border</label>
                      <Field
                        validate={validateField}
                        name="border"
                        type="text"
                        id="border"
                        placeholder="Enter Border"
                        className="form-input"
                        onChange={(e: any) => {
                          const current = params;
                          if (!current.styling) current.styling = {};
                          current.styling.border = e.target.value;
                          setParams(current);
                          handleChange(e);
                          setCode(getCode(params));
                        }}
                      />

                      {submitCount ? (
                        errors.border ? (
                          <div className="mt-1 text-danger">{errors.border}</div>
                        ) : (
                          <div className="mt-1 text-success"></div>
                        )
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  <div className={submitCount ? (errors.publisher ? 'has-error' : 'has-success') : ''}>
                    <label htmlFor="publisher">Publisher Address </label>
                    <Field
                      name="publisher"
                      type="input"
                      id="publisher"
                      placeholder="Enter publisher address"
                      className="form-input"
                      onChange={(e: any) => {
                        const current = params;
                        current.publisher = e.target.value;
                        setParams(current);
                        handleChange(e);
                        setCode(getCode(params));
                      }}
                    />

                    {submitCount ? (
                      errors.publisher ? (
                        <div className="mt-1 text-danger">{errors.publisher}</div>
                      ) : (
                        <div className="mt-1 text-success"></div>
                      )
                    ) : (
                      ''
                    )}
                  </div>
                </Form>
              )}
            </Formik>
            <div className="mockup-code mt-5  max-w-full">
              <pre data-prefix="1. " className="pl-3">
                <code>{"import { Ad } from '@targecy/sdk';  "}</code>
              </pre>
              <pre data-prefix="2. " className="pl-3">
                <code>{''}</code>
              </pre>
              <CopyOutlined
                className="float-right mr-5 active:opacity-50"
                onClick={() => copyToClipboard(code)}></CopyOutlined>
              <pre data-prefix="3. " className="max-w-full break-words  pl-3">
                <code>{code}</code>
              </pre>
            </div>
          </div>
          <div className="flex place-items-center  justify-center">
            <Ad
              // demo={{
              //   title: 'This is a demo title',
              //   description: 'This is an engaging demo description!',
              //   image:
              //     'https://www.coindesk.com/resizer/hcfZgL-G2lLBytu1w2FQPfGIxNY=/975x548/filters:quality(80):format(jpg)/cloudfront-us-east-1.images.arcpublishing.com/coindesk/J6PYAX7JBZGQLCBW2Y6FWQXEKU.jpg',
              // }}
              env={env.NEXT_PUBLIC_VERCEL_ENV}
              publisher={params.publisher}
              styling={params.styling}
            />{' '}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
