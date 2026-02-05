import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService } from '../services/api';
import PageTransition from '../components/common/PageTransition';
import LoadingSpinner from '../components/common/LoadingSpinner';
import type { Category } from '../types';

const Categories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        categoryService.getAllCategories()
            .then(data => setCategories(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Categories</h1>
                        <p className="text-xl text-gray-600">Explore topics that interest you</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map(category => (
                            <Link
                                key={category.id}
                                to={`/?category=${category.id}`}
                                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition p-8 border border-gray-100"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{category.name}</h2>
                                <p className="text-gray-600">{category.description || `Explore ${category.name.toLowerCase()} articles and insights`}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default Categories;
