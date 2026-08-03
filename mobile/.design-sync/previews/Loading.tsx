import { Loading } from 'moneyminder-mobile';

/** 기다리는 화면. 문구는 기본값이 있고 화면 성격에 맞게만 바꾼다. */
export const Default = () => <Loading />;

export const Labeled = () => <Loading label="내역을 불러오는 중..." />;
