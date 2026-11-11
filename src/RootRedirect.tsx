import { useAuth } from "./auth/authContext";
import { Navigate } from "react-router-dom";

export default function Redirect(){
  const { loading, profile } = useAuth();

  if (loading) return <InitialLoader />;

  if (profile) return (
    <Navigate to="/dashboard" replace/>
  );

  return (
    <Navigate to="/home" replace/>
  );
}

function InitialLoader() {
  return (
    <>
    <style>{`
      .s0 { fill: #002a5c } 
      .s1 { fill: #ffb034 } 
      #initial-loader {
        position: fixed;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 20px;
        background: #e7f0fa;
        z-index: 9999;
      }

      .loader-logo {
        width: 300px;
        height: auto;
      }
      
      .loading-dots {
        display: flex;
        gap: 8px;
      }
      .loading-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        opacity: 0.3;
        animation: dot-fill 1s ease-in-out infinite;
      }
      .loading-dots span:nth-child(1),
      .loading-dots span:nth-child(2) {
        background: #002a5c;
      }
      .loading-dots span:nth-child(3),
      .loading-dots span:nth-child(4),
      .loading-dots span:nth-child(5) {
        background: #ffb034;
      }
      .loading-dots span:nth-child(1) { animation-delay: 0s; }
      .loading-dots span:nth-child(2) { animation-delay: 0.12s; }
      .loading-dots span:nth-child(3) { animation-delay: 0.24s; }
      .loading-dots span:nth-child(4) { animation-delay: 0.36s; }
      .loading-dots span:nth-child(5) { animation-delay: 0.48s; }

      @keyframes dot-fill {
        0%, 100% {
          opacity: 0.3;
          transform: scale(1);
        }
        50% {
          opacity: 1;
          transform: scale(1.3);
        }
      }
    `}</style>
    <div id="initial-loader">
      <svg className="loader-logo" version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1250 244">
        <g id="Layer 1">
          <g id="Background">
            <path id="Path 0" fillRule="evenodd" className="s0" d="m0 28.5v28.5h12v130h-12v57h164v-75h-57v18h-38v-130h12v-57h-81zm7-21.5h67v43h-12v144h52v-18h43v61h-150v-43h12v-144h-12v-21.5z"/>
            <path id="Path 1" fillRule="evenodd" className="s0" d="m14 28.5v14.5h12v158h-12v29h136v-47h-29v18h-66v-158h12v-29h-53z"/>
            <path id="Path 2" fillRule="evenodd" className="s0" d="m171 28.5v28.5h12v130h-12v57h81v-57h-12v-130h12v-57h-81zm7-21.5h67v43h-12v144h12v43h-67v-43h12v-144h-12v-21.5z"/>
            <path id="Path 3" fillRule="evenodd" className="s0" d="m185 28.5v14.5h12v158h-12v29h53v-29h-12v-158h12v-29h-53z"/>
            <path id="Path 4" fillRule="evenodd" className="s0" d="m259 28.5v28.5h12l-0.01 156.5 30.51 30.49 86 0.02 30.49-30.51 0.01-156.5h12v-57h-81v57h12v130h-33v-130h12v-57h-81zm7-21.5h67v43h-12v144h47v-144h-12v-43h67v43h-12l0.01 160.5-26.51 26.49h-80l-26.51-26.49 0.01-160.5h-12v-21.5z"/>
            <path id="Path 5" fillRule="evenodd" className="s0" d="m273 28.5v14.5h12l-0.01 164.5 22.51 22.49 74 0.02 22.49-22.51 0.01-164.5h12v-29h-53v29h12v158h-61v-158h12v-29h-53z"/>
            <path id="Path 6" fillRule="evenodd" className="s1" d="m447 15.26l-15.48 15.26 0.47 182.98 30.51 30.49 105 0.02 28.49-28.51 0.01-46.5h-57v18h-50v-130h50v18h57l0.01-46.5-28.51-28.49-105.02-0.01zm18.47-8.26l99.03 0.01 24.51 24.49-0.01 36.5h-43v-18h-64v144h64v-18h43l-0.01 36.5-24.49 24.51-99-0.02-26.51-26.49-0.47-176.97 13.48-13.27z"/>
            <path id="Path 7" fillRule="evenodd" className="s1" d="m457 25.27l-11.47 11.26 0.46 170.97 22.51 22.49h93l20.51-20.49-0.01-26.5h-29v18h-78v-158h78v18h29l-0.01-26.5-20.49-20.51-93.03 0.01z"/>
            <path id="Path 8" fillRule="evenodd" className="s1" d="m603 28.5v28.5h12v130h-12v57h164v-75h-57v18h-38v-130h12v-57h-81zm7-21.5h67v43h-12v144h52v-18h43v61h-150v-43h12v-144h-12v-21.5z"/>
            <path id="Path 9" fillRule="evenodd" className="s1" d="m617 28.5v14.5h12v158h-12v29h136v-47h-29v18h-66v-158h12v-29h-53z"/>
            <path id="Path 10" fillRule="evenodd" className="s1" d="m762 28.5v28.5h12l-0.01 156.5 30.51 30.49 92 0.02 30.49-30.51 0.01-156.5h12v-57h-81v57h12v130h-39v-130h12v-57h-81zm7-21.5h67v43h-12v144h53v-144h-12v-43h67v43h-12l0.01 160.5-26.51 26.49h-86l-26.51-26.49 0.01-160.5h-12v-21.5z"/>
            <path id="Path 11" fillRule="evenodd" className="s1" d="m776 28.5v14.5h12l-0.01 164.5 22.51 22.49 80 0.02 22.49-22.51 0.01-164.5h12v-29h-53v29h12v158h-67v-158h12v-29h-53z"/>
            <path id="Path 12" fillRule="evenodd" className="s1" d="m946 28.5v28.5h12v130h-12v57l126.5 0.01 28.49-28.51 0.03-78c-11.65-11.62-15.04-15.45-15.04-16 0-0.55 3.39-4.37 7.52-8.5l7.52-7.5-0.01-75-30.51-30.49-124.5-0.01zm7-21.5l114.5-0.01 26.49 26.51 0.02 69-9.01 9c-4.96 4.95-9.01 9.45-9.01 10 0 0.55 4.05 5.05 18.02 19l-0.02 72-24.49 24.51-116.5-0.01v-43h12v-144h-12v-21.5z"/>
            <path id="Path 13" fillRule="evenodd" className="s1" d="m960 28.5v14.5h12v158h-12v29l106.5-0.01 20.51-20.49v-66c-17.3-17.28-19.02-19.54-19.02-22 0-2.46 1.72-4.72 9.51-12.5l9.51-9.5v-63l-22.51-22.49-104.5-0.01zm41 13.5l50.5 0.03 6.54 6.47-0.07 52-6.47 6.54-50.5-0.04v-32.5zm0 94l50.5 0.03 6.54 6.47-0.07 52-6.47 6.54-50.5-0.04v-32.5z"/>
            <path id="Path 14" fillRule="evenodd" className="s1" d="m1008 168.5v25.5c37.41 0.06 39.68-0.12 41.22-1.72 1.53-1.57 1.74-4.36 1.79-23.78 0.05-19.84-0.12-22.17-1.73-23.72-1.56-1.52-4.21-1.73-21.53-1.75l-19.75-0.03zm7.06-18.55l28.44 0.55v36l-28.5 0.5 0.03-18.53z"/>
            <path id="Path 15" fillRule="evenodd" className="s1" d="m1008 74.5v25.5c37.41 0.06 39.68-0.12 41.22-1.72 1.53-1.57 1.74-4.36 1.79-23.78 0.05-19.84-0.12-22.17-1.73-23.72-1.56-1.52-4.21-1.73-21.53-1.75l-19.75-0.03zm7.06-18.55l28.44 0.55v36l-28.5 0.5 0.03-18.53z"/>
            <path id="Path 16" fillRule="evenodd" className="s1" d="m1122 14.26l-14.48 14.27 0.47 90.97 30.51 30.49 55.5 0.01v37h-29v-18h-57l-0.01 46.5 28.51 28.49 85 0.02 28.49-28.51 0.02-91-31.51-31.49-53.5-0.01v-37h29v19h56l0.01-44.5-30.51-30.49-83.03-0.01zm17.47-7.26l77.03-0.01 26.5 26.51v34.5h-42v-19h-43v51l57.5 0.01 27.51 27.49-0.02 85-24.49 24.51-79-0.02-24.51-24.49 0.01-36.5h43v18h43v-51l-59.5-0.01-26.5-26.49-0.47-84.97 12.47-12.27z"/>
            <path id="Path 17" fillRule="evenodd" className="s1" d="m1132 24.27l-10.47 10.26 0.46 78.97 22.51 22.49 63.5 0.01v65h-57v-18h-29l-0.01 26.5 20.51 20.49h73l20.51-20.49v-79l-23.51-23.49-61.5-0.01v-65h57v19h28l0.01-24.5-22.51-22.49-71.04-0.01z"/>
          </g>
        </g>
      </svg>
    </div>
    </>
  );
}