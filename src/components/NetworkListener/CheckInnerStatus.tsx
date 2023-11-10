import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { checkNetworkStatus } from '../../utils/checkNetworkStatus';
import BrowserWrap from '../BrowserWrap';
const CheckInnerStatus = ({ url = 'https://www.baidu.com' }: { url?: string }) => {
  const onClick = async () => {
    const rs = await checkNetworkStatus(url);
    if(!rs){
      message.info('网络连接异常')
      return;
    }
    const inner = await checkNetworkStatus('http://erp.jd.com')
    message.info(inner ? '内部网络连接正常' : '内部网络连接异常');
  };
  return (
    <div
      style={{
        border: '1px solid #dee0e3',
        padding: '24px',
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        onClick={onClick}
        style={{
          padding: '4px 12px',
          borderRadius: '8px',
          background: '#00aa00',
          color: '#fff',
          cursor: 'pointer',
        }}
      >
        检查网络
      </div>
    </div>
  );
};
export default BrowserWrap(CheckInnerStatus);
