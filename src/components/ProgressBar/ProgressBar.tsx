import style from "./ProgressBar.module.scss";

type ProgressBarType = {
  bgcolor: string;
  completed: number;
  textColor: string;
  fullText: string;
};
export const ProgressBar = ({
  bgcolor,
  completed,
  textColor,
  fullText,
}: ProgressBarType) => {
  const fillerStyles = {
    width: `${completed}%`,
    backgroundColor: `${bgcolor}`,
  };

  const labelStyles = {
    color: `${textColor}`,
  } as React.CSSProperties | undefined;
  return (
    <div className={style.containerStyles}>
      <span style={labelStyles} className={style.labelStyles}>
        {completed === 100 ? `${fullText}` : `${completed}%`}
      </span>
      <div style={fillerStyles} className={style.fillerStyles} />
    </div>
  );
};
