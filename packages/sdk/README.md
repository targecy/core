# Targecy SDK

## Introduction

This SDK helps you interact with Targecy's network by providing a set of components and functions to easily build your own application on top of Targecy.

## Setup

### Install

```bash
npm install @targecy/sdk
```

or

```bash
yarn add @targecy/sdk
```

## Usage

To show an Ad, you can use the `<Ad />` component.

```javascript
import { Ad } from '@targecy/sdk';

<Ad publisher="0xAddress">
```

To fetch credentials, you can use the `useCredentials` hook.

```javascript
import { useCredentials } from '@targecy/sdk';
```

You can also customize styling. Please refer to our [wizard](https://app.targecy.xyz/wizard) to generate the code.

Please see our [Demo Publisher](https://demo.publisher.targecy.xyz/) for a complete example.

For help please contact us at [help@targecy.xyz](mailto:help@targecy.xyz).
