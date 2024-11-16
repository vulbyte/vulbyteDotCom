import Navbar from "@/components/navbar";

//form components
import CharacterInfoForm from "./components/CharacterInfoForm";
import ContactInfoForm from "./components/ContactInfo";
import CommissionTypeForm from "./components/CommissionTypeForm";
import LicenseForm from "./components/LicenseForm";
//import MessagingPlatformForm from "./components/MessagingPlatform";
import PaymentInfo from "./components/PaymentInfo";
import TimelineForm from "./components/TimelineForm";

//other stuff here

export default function CommStuff() {
  return (
    <div>
      <Navbar />
      <br />
      <br />
      <h2 className="bg-yellow-100 text-black">
        THIS PAGE IS UNDER DEVELOPMENT <br />
        PLEASE DO NOT FILL ANYTHING OUT, AS IF YOU DO NO DATA WILL BE SENT
        MAKING IT A WASTE OF YOUR TIME
      </h2>
      <h1 className="bg-red-500 text-3xl">interested in a commission? </h1>
      <h2 className="text-3xl"> check all this out then </h2>
      <br />
      <br />

      <div className="pl-3 pr-3">
        <div className="commForm">
          {/*beginning of forum*/}
          <h2 className="text-2xl"> contact details </h2>
          <ContactInfoForm />
          {/*<MessagingPlatformForm />*/}
          <h2 className="text-2xl"> commission details</h2>
          <CommissionTypeForm />
          <br />
          <CharacterInfoForm />
          <h2 className="text-2xl"> timeline details </h2>
          <TimelineForm />
          <h2 className="text-2xl"> license form </h2>
          <LicenseForm />
          <PaymentInfo />
        </div>
        {/*end of form*/}
      </div>
    </div>
  );
}
