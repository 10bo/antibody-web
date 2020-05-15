// Copyright (c) 2020 by Audere
//
// Use of this source code is governed by an LGPL-3.0 license that
// can be found in the LICENSE file distributed with this file.
import { APP_MODES, CURRENT_APP_MODE } from 'utils/globalConstants';
import { Theme, createStyles, makeStyles } from '@material-ui/core';
import Asset from '../ui/Asset';
import Grid from '@material-ui/core/Grid';
import PhotoUploaderPanel from '../FileUploader/PhotoUploaderPanel';
import React from 'react';
import TimedStep from './TimedStep';
import WaitStep from './WaitStep';
import transcribeTestPath from './transcribeTestPath';

export const FORMID = 'stepForm';
export const UNSET_PROFILE_ID = 'UNSET_PROFILE_ID';

export const getStepStyle = makeStyles((theme: Theme) =>
  createStyles({
    bulletList: {
      listStyleType: 'square',
      paddingLeft: '1em',
      listStylePosition: 'outside',
      '& li': {
        margin: '1rem 0',
      },
    },
    centeredAsset: {
      display: 'block',
      margin: '1rem auto',
    },
  })
);

export interface StepDetailComponentProp {
  setStepReady: (ready: boolean) => void;
  submitUrl?: string;
  testRunUID: string;
}

interface NavLink {
  default: string; // default step name for the nav.
  [type: string]: string; // Other possible links.
}

interface StepDetailsIncomplete {
  // Asset before the title.
  LeadingAsset?: React.FunctionComponent;
  title?: string;
  ContentComponent: React.FunctionComponent<StepDetailComponentProp>;
  skipStepForExistingUser?: boolean;
  // this step has a form blocking progress to the next step.
  hasFormContent?: boolean;
  isBlockingStep?: boolean;
  nav: {
    previous?: string;
    next?: NavLink;
  };
}

export interface StepDetails extends StepDetailsIncomplete {
  name: string;
}

export const START_STEP = 'waitVialReaction';

// This list represents each steps of the test kit tutorial.
const testrunSteps: { [stepName: string]: StepDetailsIncomplete } = {
  scanStrip: {
    title: 'Scan your test strip',
    ContentComponent: React.memo((props) => (
      <div>
        <div>
          Ensure your test strip is in the middle of the box, and hold your
          phone flat and directly above your test strip before taking its photo.
        </div>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Asset
              className={getStepStyle().centeredAsset}
              height={180}
              width={290}
              alt="Image of the test strip being put in its position in the box."
              src="scanthestrip.png"
            />
          </Grid>
          <Grid item xs={6}>
            <Asset
              className={getStepStyle().centeredAsset}
              height={180}
              width={290}
              alt="Image of a phone taking the test strip photo."
              src="holdphone.png"
            />
          </Grid>
        </Grid>
        {CURRENT_APP_MODE === APP_MODES.PROD && (
          <div>Choose one of the options below to take the photo.</div>
        )}
        <PhotoUploaderPanel {...props} />
      </div>
    )),
    hasFormContent: true,
    nav: {
      next: {
        default: 'waitVialReaction',
      },
    },
  },
  waitVialReaction: {
    isBlockingStep: true,
    ContentComponent: React.memo((props: StepDetailComponentProp) => {
      // TODO: make a facts list that changes every x seconds.
      return (
        <>
          <TimedStep
            description="Wait for a full minute so that the testing solution can react with the sample from the swab."
            duration={60000}
            {...props}
          />
          <h1 className="title">Did you know?</h1>
          <p>
            You can become infected by coming into close contact (about 6 feet
            or two arm lengths) with a person who has COVID-19. COVID-19 is
            primarily spread from person to person.
          </p>
        </>
      );
    }),
    nav: {
      previous: 'scanStrip',
    },
  },
};

const TESTRUN_STEPS: { [stepName: string]: StepDetails } = {};

// Populate the name field
Object.getOwnPropertyNames(testrunSteps).forEach((stepName: string) => {
  TESTRUN_STEPS[stepName] = {
    ...testrunSteps[stepName],
    name: stepName,
  };
});

transcribeTestPath(TESTRUN_STEPS);

export { TESTRUN_STEPS };

export function getNextStepOfType(param: {
  currentStepName: string;
  nextStepType: string;
}): string | undefined {
  const nextNav = TESTRUN_STEPS[param.currentStepName].nav.next;
  if (nextNav) {
    return nextNav[param.nextStepType];
  }
  return undefined;
}

export function getNextDefaultStep(param: {
  currentStepName: string;
}): string | undefined {
  return getNextStepOfType({
    ...param,
    nextStepType: 'default',
  });
}

export function getPreviousStep(param: {
  currentStepName: string;
}): string | undefined {
  return TESTRUN_STEPS[param.currentStepName].nav.previous;
}
