import React, { useState, useEffect } from 'react';
import '../HomeComponent/Courses.css'
import { Link, useLocation } from 'react-router-dom';
import UserHeader from '../Header/UserHeader';
import { collection, query, where, getDocs, getFirestore } from 'firebase/firestore';
import { firebaseApp } from '../Firebase';

const SearchCourse = () => {
    const location = useLocation();
    const searchQuery = new URLSearchParams(location.search).get('query');
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const db = getFirestore(firebaseApp);
                const q = query(collection(db, 'playlists'), where('title', '>=', searchQuery));
                const querySnapshot = await getDocs(q);
                const fetchedCourses = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedCourses.push({
                        id: doc.id,
                        title: data.title,
                        tutor: data.tutor,
                        date: data.date,
                        thumbnail: data.thumbnail,
                        tutorName : data.userName,
                        tutorProfile:data.userProfilePhoto
                        // Add other fields you need
                    });
                });
                setCourses(fetchedCourses);
                setLoading(false);
                setError(null); // Clear error if successful
            } catch (error) {
                // console.error('Error fetching courses:', error);
                setLoading(false);
                setError('An error occurred while fetching courses. Please try again or search for something different.');
            }
        };

        fetchCourses();
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery) {
            const fetchCourses = async () => {
                try {
                    const db = getFirestore(firebaseApp);
                    const q = query(collection(db, 'playlists'));
                    const querySnapshot = await getDocs(q);
                    const fetchedCourses = [];
                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const title = data.title.toLowerCase(); // Normalize title to lowercase
                        const normalizedSearchQuery = searchQuery.toLowerCase(); // Normalize search query to lowercase
                        if (title.includes(normalizedSearchQuery)) {
                            fetchedCourses.push({
                                id: doc.id,
                                title: data.title,
                                tutor: data.tutor,
                                date: data.date,
                                thumbnail: data.thumbnail,
                                tutorName: data.userName,
                                tutorProfile: data.userProfilePhoto
                                // Add other fields you need
                            });
                        }
                    });
                    setCourses(fetchedCourses);
                    setLoading(false);
                    setError(null); // Clear error if successful
                } catch (error) {
                    console.error('Error fetching courses:', error);
                    setLoading(false);
                    setError('An error occurred while fetching courses. Please try again or search for something different.');
                }
            };
    
            fetchCourses();
        }
    }, [searchQuery]);
    
    

    return (
        <div>
            <UserHeader />
            <section className="Courses">
                <h1 className="heading">Search Results for "{searchQuery}"</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p className='error'>{error}</p>
                ) : courses.length === 0 ? (
                    <p className='empty'>No courses found for "{searchQuery}".</p>
                ) : (
                    <div className="box-container">
                        {courses.map(course => (
                            <div className="box" key={course.id}>
                                <div className="tutor">
                                    <img src={course.tutorProfile} alt="" /> {/* Tutor Image */}
                                    <div>
                                        <h3>{course.tutorName}</h3>
                                        <span>{course.date}</span>
                                    </div>
                                </div>
                                <img src={course.thumbnail} className="thumb" alt="" /> {/* Course Thumbnail */}
                                <h3 className="title">{course.title}</h3>
                                <Link to="/" className="inline-btn">View Playlist</Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default SearchCourse;
