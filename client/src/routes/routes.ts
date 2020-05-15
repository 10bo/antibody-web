// Copyright (c) 2020 by Audere
//
// Use of this source code is governed by an LGPL-3.0 license that
// can be found in the LICENSE file distributed with this file.
import Home from 'components/Home/Home';
import TestRunSteps from 'components/TestRun/TestRunSteps';

export interface seoDefinition {
  title: string;
  description: string;
}
export interface DashboardRoute {
  path: string;
  exact: boolean;
  navTitle?: string;
  seo: seoDefinition;
  component: React.ComponentClass<any, any> | React.FunctionComponent<any>;
}

export const ROUTE_DEFINITIONS: { [key: string]: DashboardRoute } = {
  HOME: {
    path: '/',
    exact: true,
    navTitle: 'Home',
    seo: {
      title: 'Home',
      description: 'Your Homepage for the OpenRDT Dashboard',
    },
    component: Home,
  },
  PERFORMTEST: {
    path: '/test/:testRunUID/:step',
    exact: false,
    seo: {
      title: 'Perform a test',
      description: 'Step by step flow to perform a test.',
    },
    component: TestRunSteps,
  },
};

ROUTE_DEFINITIONS.LANDING = {
  ...ROUTE_DEFINITIONS.LOGIN,
  path: '/',
};

export const ROUTES: Array<DashboardRoute> = Object.getOwnPropertyNames(
  ROUTE_DEFINITIONS
).map((routename: string) => ROUTE_DEFINITIONS[routename]);
