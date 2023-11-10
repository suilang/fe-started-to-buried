import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { checkNetworkStatus } from '../../utils/checkNetworkStatus';
const CheckNetworkStatus = ({ url = 'https://www.baidu.com' }: { url?: string }) => {
  const onClick = async () => {
    const rs = await checkNetworkStatus(url);
    message.info(rs ? '网络连接正常' : '网络连接异常');
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
export default CheckNetworkStatus;
