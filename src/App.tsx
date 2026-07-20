import { colors, fonts } from './theme';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { MetaPill } from './components/MetaPill';
import { StepTabs, STEP_SUBTITLES } from './components/StepTabs';
import { BottomNav } from './components/BottomNav';
import { Step1Upload } from './steps/Step1Upload';
import { Step2Items } from './steps/Step2Items';
import { Step3Assign } from './steps/Step3Assign';
import { Step4Summary } from './steps/Step4Summary';
import { useBillState } from './state/useBillState';
import { fmt } from './lib/currency';

export default function App() {
  const bill = useBillState();
  const hasInvalidItems = bill.invalidItemIds.size > 0;
  // Block advancing from Assign -> Summary while any manually-split item
  // doesn't add up to 100% — the per-person breakdown would be wrong otherwise.
  const blockedSteps = hasInvalidItems ? new Set([3]) : new Set<number>();
  const nextBlocked = bill.step === 2 && hasInvalidItems;

  const onNext = () => {
    if (nextBlocked) return;
    if (bill.step === 3) {
      bill.reset();
    } else {
      bill.setStep(bill.step + 1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', background: colors.background, fontFamily: fonts.body, color: colors.ink,
      padding: '36px 6vw 80px', display: 'flex', flexDirection: 'column',
    }}>
      <Header stepNum={bill.step + 1} />
      <Hero subtitle={STEP_SUBTITLES[bill.step]} />
      <MetaPill peopleCount={bill.people.length} itemsCount={bill.items.length} subtotalFmt={fmt(bill.totals.subtotal)} />
      <StepTabs step={bill.step} disabledSteps={blockedSteps} onSelect={bill.setStep} />

      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>
        {bill.step === 0 && <Step1Upload bill={bill} />}
        {bill.step === 1 && <Step2Items bill={bill} />}
        {bill.step === 2 && <Step3Assign bill={bill} />}
        {bill.step === 3 && <Step4Summary bill={bill} />}

        <BottomNav step={bill.step} disabled={nextBlocked} onPrev={() => bill.setStep(bill.step - 1)} onNext={onNext} />
      </div>
    </div>
  );
}
