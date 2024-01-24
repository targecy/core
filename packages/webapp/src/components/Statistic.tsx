import clsx from 'clsx';

export type StatisticProps = {
  title: string;
  statistic?: string | number;
  className?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
};

export default function Statistic(props: StatisticProps) {
  const { title, statistic, variant = 'primary', className } = props;

  return (
    <div>
      <div>{title}</div>
      <div className={clsx(`text-lg text-${variant}`, className)}>{statistic ?? 0}</div>
    </div>
  );
}
