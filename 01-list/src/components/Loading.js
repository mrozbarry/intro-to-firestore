import { h } from 'hyperapp';

export default ({ loading }, children) => {
  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>{children}</div>;
}
