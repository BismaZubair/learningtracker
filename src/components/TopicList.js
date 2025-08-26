import React, { useContext } from 'react';
import { LearningContext } from '../context/LearningContext';
import TopicCard from './TopicCard';

const TopicList = () => {
  const { filteredTopics } = useContext(LearningContext);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredTopics.length > 0 ? (
        filteredTopics.map(topic => (
          <TopicCard key={topic.id} topic={topic} />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No topics found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default TopicList;