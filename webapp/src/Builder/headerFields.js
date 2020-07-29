import { translate } from '../i18n/locale';


export let headerFields = []


export function updateHeaderFields(){

  headerFields = [
    {
      label: translate('name'), id: 'name', mandatory: true, placeholder: translate('name_placeholder'),
    },
    {
      label: translate('email'), id: 'email', mandatory: true, placeholder: translate('email_placeholder'),
    },
    {
      label: 'linkedin', id: 'linkedin', mandatory: false, placeholder: translate('linkedin_placeholder'),
    },
    {
      label: translate('homepage'), id: 'homepage', mandatory: false, placeholder: translate('homepage_placeholder'),
    },
    {
      label: 'github', id: 'github', mandatory: false, placeholder: translate('github_placeholder'),
    },
    {
      label: translate('phone'), id: 'phone', mandatory: false, placeholder: translate('phone_placeholder'),
    },
    {
      label: translate('birthday'), id: 'birthday', mandatory: false, placeholder: translate('date_format'),
    },
    {
      label: translate('address'), id: 'address', mandatory: false, placeholder: translate('address_placeholder'),
    },
  ];

}



