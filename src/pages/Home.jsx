import { useState, useEffect } from 'react';
import { getCourses, getCourseCount, getTestimonials } from '../services/db';
import { getPosts } from '../services/postsService';
import { HeroSection } from '../components/home/HeroSection';
import { FeaturedCourses } from '../components/home/FeaturedCourses';
import { CertificationsSection } from '../components/home/CertificationsSection';
import { TestimonialsSection } from '../components/home/TestimonialsSection';
import { RecentPostsSection } from '../components/home/RecentPostsSection';
import { FacebookCommunitySection } from '../components/home/FacebookCommunitySection';

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [recentPosts, setRecentPosts] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [totalCount, setTotalCount] = useState(() => {
    const cached = localStorage.getItem('cecati_course_count');
    return cached ? parseInt(cached, 10) : 35;
  });

  useEffect(() => {
    document.title = "CECATI 122 - Inicio";
    const fetchData = async () => {
      try {
        const data = await getCourses();
        setCourses(data.slice(0, 3));
        const count = await getCourseCount();
        setTotalCount(count);

        const postsData = await getPosts('Todas');
        setRecentPosts(postsData.slice(0, 3));

        const testimonialsData = await getTestimonials();
        setTestimonials(testimonialsData);
      } catch (err) {
        console.error("Error al obtener datos:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="main overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">
      <HeroSection totalCount={totalCount} />
      <FeaturedCourses courses={courses} />
      <CertificationsSection />
      <TestimonialsSection testimonials={testimonials} />
      <RecentPostsSection recentPosts={recentPosts} />
      <FacebookCommunitySection />
    </main>
  );
}
