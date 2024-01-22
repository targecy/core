import clsx from 'clsx';

export type StatisticProps = {
  title: string;
  statistic?: string | number;
  className?: string;
};

export default function Statistic(props: StatisticProps) {
  const { title, statistic, className } = props;

  return (
    <div>
      <div>{title}</div>
      <div className={clsx('text-lg text-primary', className)}>{statistic ?? 0}</div>
    </div>
  );
}
