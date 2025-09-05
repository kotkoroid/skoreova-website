export interface Player {
	image: string;
	name: string;
	club: string;
	position: string;
	nationality: string;
	goals: number;
	assists: number;
}

export type CardPosition = 'far-left' | 'left' | 'center' | 'right' | 'far-right';
