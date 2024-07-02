import React, { useRef } from "react";

const TrueCallerSdk =()=> {

    const inputElem = useRef();

    const generateRandomString =(length)=> {
        let result = "";
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
      };

    const triggerTrueCallerSdk =(e)=> {
        e.preventDefault();
    
        const randomString = generateRandomString(16);
    
        if(inputElem.current) {
          (inputElem.current).focus();
        }
        window.location = `truecallersdk://truesdk/web_verify?type=btmsheet&requestNonce=${randomString}&partnerKey=NN1G957676d4c97204515b82ecef7b2d675fc&partnerName=Naukrigulf&lang=en&privacyUrl=https://www.naukrigulf.com/privacy-policy&termsUrl=https://www.naukrigulf.com/terms-and-conditions&loginPrefix=proceed&loginSuffix=verifymobile&ctaPrefix=proceedwith&ctaColor=%230083da&ctaTextColor=%23fff&btnShape=round&skipOption=later&ttl=15000`;
        setTimeout(function() {
          if( document.hasFocus() ){
            // Truecaller app not present on the device
            alert("truecaller not present on device");
          }
        }, 1000);
      };

      return <div>
        <input type="text" className="truecaller-input" ref={inputElem}></input>
        <button className="truecaller-sdk" onClick={triggerTrueCallerSdk}>Verify Truecaller</button>
      </div>

}


export default TrueCallerSdk;