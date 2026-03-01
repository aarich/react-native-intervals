import { createLiveActivity } from 'expo-widgets';
import { Image, Text, VStack, ProgressView } from '@expo/ui/swift-ui';
import { font, padding, foregroundStyle } from '@expo/ui/swift-ui/modifiers';

export type LiveStatus = {
  status: 'notstarted' | 'running' | 'paused' | 'done';
  totalElapsedMs: number;
  currentElapsedMs: number;
  title?: string;
  nextStepName?: string;
  currentStepMs: number;
  totalStepMs: number;
};

type LiveActivityProps = {
  showProgress: boolean;
  title?: string;
  nextStepName?: string;
  totalElapsedMs: number;
  currentStepMs: number;
  totalStepMs: number;
};

const LIVE_ACTIVITY_NAME = 'IntervalsLiveActivity';
const liveActivityFactory = createLiveActivity<LiveActivityProps>(
  LIVE_ACTIVITY_NAME,
  (props) => {
    'widget';
    const p: LiveActivityProps = props ?? {
      showProgress: false,
      totalElapsedMs: 0,
      totalStepMs: 0,
      currentStepMs: 0,
    };
    const padAll = [padding({ all: 12 })];
    const nextStepStr = p.nextStepName ? `Next: ${p.nextStepName}` : '';
    const title = p.title || 'Running';
    const { currentStepMs, totalStepMs } = p;
    const safeTotalStepMs = Math.max(totalStepMs, 1000);
    const safeCurrentStepMs = Math.min(
      Math.max(currentStepMs, 0),
      safeTotalStepMs,
    );

    const lower = new Date();
    lower.setMilliseconds(lower.getMilliseconds() - safeCurrentStepMs);
    const upper = new Date();
    upper.setMilliseconds(
      upper.getMilliseconds() + safeTotalStepMs - safeCurrentStepMs,
    );

    return {
      banner: (
        <VStack modifiers={padAll}>
          <Text modifiers={[font({ weight: 'bold', size: 16 })]}>{title}</Text>
          {p.showProgress ? (
            <ProgressView timerInterval={{ lower, upper }} countsDown={false} />
          ) : (
            <Text modifiers={[font({ size: 13 }), foregroundStyle('gray')]}>
              Waiting for resume
            </Text>
          )}
          {nextStepStr ? (
            <Text modifiers={[font({ size: 14 }), foregroundStyle('gray')]}>
              {nextStepStr}
            </Text>
          ) : null}
        </VStack>
      ),
      compactLeading: p.showProgress ? (
        <ProgressView timerInterval={{ lower, upper }} countsDown={false} />
      ) : (
        <Image systemName="timer" color="#007AFF" />
      ),
      compactTrailing: <Text modifiers={[font({ size: 14 })]}>{title}</Text>,
      minimal: <Image systemName="timer" color="#007AFF" />,
      expandedLeading: (
        <VStack modifiers={padAll}>
          <Text modifiers={[font({ weight: 'bold', size: 18 })]}>{title}</Text>
          {nextStepStr ? (
            <Text modifiers={[font({ size: 14 }), foregroundStyle('gray')]}>
              {nextStepStr}
            </Text>
          ) : null}
        </VStack>
      ),
      expandedTrailing: (
        <VStack modifiers={padAll}>
          <Text modifiers={[font({ weight: 'bold', size: 20 })]}>
            {`${Math.floor(p.totalElapsedMs / 1000)}s`}
          </Text>
        </VStack>
      ),
      expandedBottom: (
        <VStack modifiers={padAll}>
          {p.showProgress ? (
            <ProgressView timerInterval={{ lower, upper }} countsDown={false} />
          ) : (
            <Text modifiers={[font({ size: 13 }), foregroundStyle('gray')]}>
              Waiting for resume
            </Text>
          )}
        </VStack>
      ),
    };
  },
);

const mapStatusToProps = (status: LiveStatus): LiveActivityProps => ({
  showProgress: status.status === 'running' && status.totalStepMs > 0,
  totalElapsedMs: status.totalElapsedMs,
  title: status.title,
  nextStepName: status.nextStepName,
  currentStepMs: status.currentStepMs,
  totalStepMs: status.totalStepMs,
});

let lastUpdate = 0;
let lastSignature: string | undefined;
let syncQueue: Promise<void> = Promise.resolve();

const getAdaptiveUpdateIntervalMs = (status: LiveStatus): number => {
  const remainingStepMs = Math.max(
    status.totalStepMs - status.currentStepMs,
    0,
  );

  // Match the app timer cadence near transitions, but back off during long steps.
  if (remainingStepMs <= 1000) {
    return 200;
  }
  if (remainingStepMs <= 5000) {
    return 500;
  }
  if (remainingStepMs <= 15000) {
    return 1000;
  }
  return 2000;
};

export const syncLiveActivity = async (
  status: LiveStatus,
  showLiveActivity: boolean,
) => {
  syncQueue = syncQueue
    .then(async () => {
      if (
        !showLiveActivity ||
        status.status === 'done' ||
        status.status === 'notstarted'
      ) {
        lastUpdate = 0;
        lastSignature = undefined;
        await stopLiveActivity();
        return;
      }

      const props = mapStatusToProps(status);
      const clampedProps: LiveActivityProps = {
        ...props,
        title:
          props.title || (status.status === 'paused' ? 'Paused' : 'Running'),
        totalStepMs: Math.max(props.totalStepMs, 1000),
        currentStepMs: Math.max(props.currentStepMs, 0),
      };
      const signature = `${status.status}|${props.title ?? ''}|${
        props.nextStepName ?? ''
      }|${props.totalStepMs}|${props.showProgress}`;

      // Update more often as the current step approaches completion.
      const minUpdateIntervalMs = getAdaptiveUpdateIntervalMs(status);
      const now = Date.now();
      const changed = signature !== lastSignature;
      if (!changed && now - lastUpdate < minUpdateIntervalMs) {
        return;
      }
      lastUpdate = now;
      lastSignature = signature;

      const instances = liveActivityFactory.getInstances();
      if (instances.length > 0) {
        const activity = instances[0];
        // Keep only one active activity instance.
        for (let i = 1; i < instances.length; i++) {
          await instances[i].end('immediate').catch(() => {});
        }
        await activity.update(clampedProps);
      } else {
        await Promise.resolve(liveActivityFactory.start(clampedProps));
      }
    })
    .catch((e) => {
      console.error(e);
    });

  await syncQueue;
};

export const stopLiveActivity = async () => {
  try {
    lastSignature = undefined;
    const instances = liveActivityFactory.getInstances();
    await Promise.all(
      instances.map((inst) => inst.end('immediate').catch(() => {})),
    );
  } catch (e) {
    console.error(e);
  }
};
