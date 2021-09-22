import { message, notification } from 'antd';
import { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import CustomError from 'rodolfohiok-sdk/dist/CustomError';
import AuthorizationService from '../auth/Authorization.service';
import CashFlowExpensesView from './views/CashFlowExpenses.view';
import CashFlowRevenuesView from './views/CashFlowRevenues.view';
import HomeView from './views/Home.view';
import PaymentCreateView from './views/PaymentCreate.view';
import PaymentDetailsView from './views/PaymentDetails.view';
import PaymentListView from './views/PaymentList.view';
import UserCreateView from './views/UserCreate.view';
import UserDetailsView from './views/UserDetails.view';
import UserEditView from './views/UserEdit.view';
import UserListView from './views/UserList.view';

export default function Routes() {
  const history = useHistory();

  useEffect(() => {
    window.onunhandledrejection = ({ reason }) => {
      if (reason instanceof CustomError) {
        if (reason.data?.objects) {
          reason.data.objects.forEach((error) => {
            message.error(error.userMessage);
          });
        } else {
          notification.error({
            message: reason.message,
            description:
              reason.data?.detail === 'Network reason'
                ? 'Erro na rede'
                : reason.data?.detail,
          });
        }
      } else {
        reason?.data?.objects?.forEach((object: { userMessage: string }) => {
          message.error(object.userMessage);
        });

        notification.error({
          message: reason?.message || 'Houve um erro',
        });
      }
    };

    return () => {
      window.onunhandledrejection = null;
    };
  }, []);

  useEffect(() => {
    async function identify() {
      const isInAuthorizationRoute = window.location.pathname === '/authorize';
      const code = new URLSearchParams(window.location.search).get('code');

      const codeVerifier = AuthorizationService.getCodeVerifier();
      const accessToken = AuthorizationService.getAccessToken();

      if (!accessToken && !isInAuthorizationRoute) {
        AuthorizationService.imperativelySendToLoginScreen();
      }

      if (isInAuthorizationRoute) {
        if (!code) {
          notification.error({
            message: 'Código não foi informado',
          });
          return;
        }

        if (!codeVerifier) {
          // necessário fazer o logout
          window.alert('TODO: IMPLEMENTAR LOGOUT');
          return;
        }

        const { access_token, refresh_token } =
          await AuthorizationService.getFirstAccessToken({
            code,
            codeVerifier,
            redirectUri: 'http://localhost:3000/authorize',
          });

        AuthorizationService.setAccessToken(access_token);
        AuthorizationService.setRefreshToken(refresh_token);

        history.push('/');
      }
    }

    identify();
  }, [history]);

  return (
    <Switch>
      <Route path={'/'} exact component={HomeView} />
      <Route path={'/usuarios'} exact component={UserListView} />
      <Route path={'/usuarios/cadastro'} exact component={UserCreateView} />
      <Route path={'/usuarios/edicao/:id'} exact component={UserEditView} />
      <Route path={'/usuarios/:id'} exact component={UserDetailsView} />
      <Route path={'/pagamentos'} exact component={PaymentListView} />
      <Route
        path={'/pagamentos/cadastro'}
        exact
        component={PaymentCreateView}
      />
      <Route path={'/pagamentos/:id'} exact component={PaymentDetailsView} />
      <Route
        path={'/fluxo-de-caixa/despesas'}
        exact
        component={CashFlowExpensesView}
      />
      <Route
        path={'/fluxo-de-caixa/receitas'}
        exact
        component={CashFlowRevenuesView}
      />
    </Switch>
  );
}
