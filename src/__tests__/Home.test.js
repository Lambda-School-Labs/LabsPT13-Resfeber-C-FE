import React from 'react';
import { render, cleanup, wait, waitFor } from '@testing-library/react';
import { HomePage } from '../components/pages/Home';
import { LoadingComponent } from '../components/common';
import { BrowserRouter as Router } from 'react-router-dom';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { reducers } from '../state/reducers';

const store = createStore(reducers, applyMiddleware(thunk));

afterEach(cleanup);

jest.mock('@okta/okta-react', () => ({
  useOktaAuth: () => {
    return {
      authState: {
        isAuthenticated: true,
      },
      authService: {
        getUser: () => Promise.resolve({ name: 'sara' }),
      },
    };
  },
}));

describe('<HomeContainer /> testing suite', () => {
  test('mounts a page', async () => {
    const { findByText, getByText, queryByText } = render(
      <Provider store={store}>
        <Router>
          <HomePage
            LoadingComponent={() => (
              <LoadingComponent message="...fetching profile" />
            )}
          />
        </Router>
      </Provider>
    );
    let loader = getByText(/...fetching profile/i);
    expect(loader).toBeInTheDocument();

    await waitFor(async () => {
      await findByText(/welcome sara/i);
    });
    loader = queryByText(/...fetching profile/i);
    expect(loader).toBeNull();
  });
});
