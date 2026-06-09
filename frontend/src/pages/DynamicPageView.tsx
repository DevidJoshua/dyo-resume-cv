import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { Page } from '../types';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import DynamicPage from '../components/common/DynamicPage';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DynamicPageView = () => {
  const { slug } = useParams();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/pages/slug/${slug}`)
      .then((res) => setPage(res.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <><Navbar /><LoadingSpinner /><Footer /></>;
  if (!page) return <><Navbar /><div className="container" style={{ paddingTop: 120, textAlign: 'center' }}><h2>Page not found</h2></div><Footer /></>;

  return (
    <>
      <Navbar />
      <DynamicPage page={page} />
      <Footer />
    </>
  );
};

export default DynamicPageView;
