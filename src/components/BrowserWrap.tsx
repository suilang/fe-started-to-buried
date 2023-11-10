import BrowserOnly from '@docusaurus/BrowserOnly';
import React, { FunctionComponent } from 'react';

export default function BrowserWrap<T>(Comp: FunctionComponent<T>) {
  return (props: T) => <BrowserOnly>{() => <Comp {...props} />}</BrowserOnly>;
}
