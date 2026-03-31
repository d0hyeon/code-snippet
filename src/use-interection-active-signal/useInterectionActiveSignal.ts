import { useCallback, useEffect, useRef } from 'react'

type Options = {
  sensitivity?: number
  duration?: number
  once?: boolean
}

type SensitivityPreset = 'low' | 'medium' | 'high'

type PresetOptions = {
  sensitivity?: SensitivityPreset
  once?: boolean
}

const PRESETS: Record<SensitivityPreset, { sensitivity: number; duration: number }> = {
  low: { sensitivity: 6, duration: 10000 },
  medium: { sensitivity: 4, duration: 8000 },
  high: { sensitivity: 2, duration: 5000 }
}


export function useInterectionActiveSignal(
  callback: () => void,
  options: Options | PresetOptions = { once: false, sensitivity: 'medium' }
) {
  const { once = false } = options

  const { sensitivity, duration } =
    typeof options.sensitivity === 'string'
      ? PRESETS[options.sensitivity]
      : { ...PRESETS.medium, ...(options as Options) }

  
  const timestampsRef = useRef<number[]>([]);
  const measure = useCallback(() => {
    const now = Date.now()
    const last = timestampsRef.current.at(-1);

    const reset = () => {
      timestampsRef.current = [];
    }

    if (last != null && now - last < 20) {
      /* @NOTE 20밀리초 이하는 중복 이벤트로 간주 */
      return { measurements: timestampsRef.current, reset };
    }

    timestampsRef.current.push(now)
    while (
      timestampsRef.current.length &&
      now - timestampsRef.current[0] > duration
    ) {
      timestampsRef.current.shift()
    }
    
    return { measurements: timestampsRef.current, reset };
  }, [duration])


  useEffect(() => {
    const events: (keyof WindowEventMap)[] = ['pointerdown', 'keydown', 'wheel'];

    const unsubscribe = () => {
      events.forEach((event) =>
        window.removeEventListener(event, handler, true)
      )
    }

    const handler = () => {
      const { measurements, reset } = measure();
      if (measurements.length >= sensitivity) {
        callback();
        reset();

        if (once) {
          unsubscribe();
        }
      }
    }
    
    events.forEach((event) =>
      window.addEventListener(event, handler, {
        passive: true,
        capture: true
      })
    )

    return unsubscribe;
  }, [sensitivity, measure])
}
