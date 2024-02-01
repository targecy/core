// import React from 'react';



// export type AdLayoutProps = {
//   id?: string;

//   title: string;
//   description: string;
//   image: string;

//   styling?: AdStyling;

//   children?: React.ReactNode;
// };

// const AdLayout: React.FC<AdLayoutProps> = (props: AdLayoutProps) => {
//   const { id, title, description, image, styling, children } = props;

//   return (
//     <div className="max-w-full">
//       <div className="w-full h-full shadow-xl" key={id}>
//         <img style={{ objectFit: 'cover', width: '100%', height: '50%' }} src={image} />
//         <div className="card-body overflow-hidden gap-3 flex flex-col p-4">
//           <h1 className="card-title text-base" style={{ color: styling?.titleColor }}>
//             {title}
//           </h1>
//           <p className="text-xs" style={{ color: styling?.subtitleColor }}>
//             {description}
//           </p>

//           {children}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(AdLayout);
