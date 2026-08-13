import dogWave from '../assets/dog/dog-wave.svg'
import dogStretch from '../assets/dog/dog-stretch.svg'
import dogCuddle from '../assets/dog/dog-cuddle.svg'
import dogSitSleep from '../assets/dog/dog-sit-sleep.svg'
import dogDreaming from '../assets/dog/dog-dreaming.svg'
import dogTag from '../assets/dog/dog-tag.svg'
import dogOk from '../assets/dog/dog-ok.svg'
import dogLying from '../assets/dog/dog-lying.svg'
import dogListen from '../assets/dog/dog-listen.svg'
import dogExhausted from '../assets/dog/dog-exhausted.svg'
import dogNotGood from '../assets/dog/dog-not-good.svg'
import dogNormal from '../assets/dog/dog-normal.svg'
import dogGood from '../assets/dog/dog-good.svg'
import dogSleepWell from '../assets/dog/dog-sleep-well.svg'
import dogPeek from '../assets/dog/dog-peek.svg'
import dogMeditate from '../assets/dog/dog-meditate.svg'
import dogRoll from '../assets/dog/dog-roll.svg'
import dogSleep from '../assets/dog/dog-sleep.svg'
import './Pet.css'

export type PetPose =
  | 'wave'
  | 'stretch'
  | 'cuddle'
  | 'sitSleep'
  | 'dreaming'
  | 'tag'
  | 'ok'
  | 'lying'
  | 'listen'
  | 'exhausted'
  | 'notGood'
  | 'normal'
  | 'good'
  | 'sleepWell'
  | 'peek'
  | 'meditate'
  | 'roll'
  | 'sleep'

const POSES: Record<PetPose, string> = {
  wave: dogWave,
  stretch: dogStretch,
  cuddle: dogCuddle,
  sitSleep: dogSitSleep,
  dreaming: dogDreaming,
  tag: dogTag,
  ok: dogOk,
  lying: dogLying,
  listen: dogListen,
  exhausted: dogExhausted,
  notGood: dogNotGood,
  normal: dogNormal,
  good: dogGood,
  sleepWell: dogSleepWell,
  peek: dogPeek,
  meditate: dogMeditate,
  roll: dogRoll,
  sleep: dogSleep,
}

interface Props {
  pose?: PetPose
  size?: number
  /** 睡眠相關姿態的呼吸感浮動動畫 */
  breathing?: boolean
  className?: string
}

/** Pet — 使用者手繪的陪伴寵物插畫（名字可在設定裡改，預設「咘咘」） */
export default function Pet({ pose = 'wave', size = 160, breathing, className = '' }: Props) {
  return (
    <span
      className={`pet${breathing ? ' pet-breathing' : ''} ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={POSES[pose]} width={size} height={size} alt="陪伴寵物" draggable={false} />
    </span>
  )
}
