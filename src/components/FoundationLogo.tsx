import React from 'react';
import { BrandLogo, BrandLogoProps } from './common/BrandLogo';

export type FoundationLogoProps = BrandLogoProps;

export const FoundationLogo: React.FC<FoundationLogoProps> = (props) => {
  return <BrandLogo {...props} />;
};

export default FoundationLogo;
