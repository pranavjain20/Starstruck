import { useState } from "react";
import { PhotoUpload } from "./components/PhotoUpload/PhotoUpload";
import { ConnectAccounts } from "./components/ConnectAccounts/ConnectAccounts";
import { ProfileAnalysis } from "./components/ProfileAnalysis/ProfileAnalysis";
import { SwipeScreen } from "./components/SwipeScreen/SwipeScreen";

export default function App() {
  const [step, setStep] = useState(1);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [userName, setUserName] = useState("");

  if (step === 1) return <PhotoUpload onContinue={(photos, name) => { setUserPhoto(photos[0] ?? null); setUserName(name); setStep(2); }} />;
  if (step === 2) return <ConnectAccounts onContinue={() => setStep(3)} />;
  if (step === 3) return <ProfileAnalysis onContinue={() => setStep(4)} />;
  return <SwipeScreen userPhoto={userPhoto} userName={userName} />;
}
