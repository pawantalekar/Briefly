import PageTransition from '../components/common/PageTransition';

const About = () => {
    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-6">About Briefly</h1>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-xl text-gray-700 mb-6">
                                Briefly is a modern blogging platform designed for writers, thinkers, and storytellers who want to share their ideas with the world.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
                            <p className="text-gray-700 mb-4">
                                We believe that everyone has a story to tell. Our mission is to provide a simple, elegant platform where writers can focus on what matters most: creating great content.
                            </p>

                            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">What We Offer</h2>
                            <ul className="space-y-3 text-gray-700 mb-6">
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    <span>Clean, distraction-free writing experience with rich text editing</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    <span>Beautiful, responsive design that works on all devices</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    <span>Powerful categorization and tagging system</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    <span>Engage with readers through comments and likes</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary-600 mr-2">•</span>
                                    <span>Track your blog's performance with analytics</span>
                                </li>
                            </ul>

                            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Join Our Community</h2>
                            <p className="text-gray-700 mb-6">
                                Whether you're a seasoned blogger or just starting out, Briefly is the perfect place to share your voice. Join thousands of writers who are already sharing their stories on our platform.
                            </p>

                            <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
                                <p className="text-primary-900 font-semibold mb-2">Ready to start writing?</p>
                                <p className="text-primary-700">Create your free account today and publish your first blog post in minutes.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default About;
