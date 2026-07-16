import React from 'react'

const AssetImage = ({ asset, alt = '', className = '', ...props }) => {
  if (!asset) {
    return <div className={`bg-gray-100 ${className}`} aria-label={alt} {...props} />
  }

  if (typeof asset === 'string') {
    return <img src={asset} alt={alt} className={className} {...props} />
  }

  if (React.isValidElement(asset)) {
    return React.cloneElement(asset, {
      className: [asset.props.className, className].filter(Boolean).join(' '),
      ...props,
    })
  }

  const Component = asset
  return <Component className={className} title={alt} {...props} />
}

export default AssetImage
