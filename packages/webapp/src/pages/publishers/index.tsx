import { useGetAllPublishersQuery } from '~~/generated/graphql.types';

const PublishersPage = () => {
  const publishers = useGetAllPublishersQuery();

  return (
    <div className="panel">
      <h5 className="text-lg font-semibold dark:text-white-light">Publishers</h5>
      {publishers.data?.publishers.map((publisher) => (
        <div key={publisher.id}>
          <h1>{publisher.id}</h1>
          <h2>{publisher.impressions}</h2>
        </div>
      ))}
    </div>
  );
};

export default PublishersPage;
