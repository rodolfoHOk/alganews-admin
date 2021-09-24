import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { setBreadcrumb } from '../store/Ui.slice';

export default function useBreadcrumb(newBreadcrumb?: string) {
  const dispatch = useDispatch<AppDispatch>();

  const breadcrumb = useSelector((state: RootState) => state.ui.breadcrumb);

  useEffect(() => {
    if (newBreadcrumb) dispatch(setBreadcrumb(newBreadcrumb.split('/')));
  }, [dispatch, newBreadcrumb]);

  return {
    breadcrumb,
  };
}
