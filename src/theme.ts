// Тема Warhammer 40k

export const FONT = 'Cinzel';

export const C = {
  bg: '#0B0A08',
  panel: '#17150F',
  panel2: '#201D17',
  bone: '#EBDEB8',
  boneDim: '#ADA180',
  gold: '#C29E4D',
  goldBright: '#EDCC73',
  blood: '#8C1D16',
  bloodBright: '#CC291A',
};

export const goldHeader = (size: number) => ({
  fontSize: size,
  fontFamily: FONT,
  fontWeight: '700' as const,
  color: C.bone,
});

export const subtitleStyle = {
  fontSize: 11,
  letterSpacing: 1.5,
  color: C.gold,
  textAlign: 'center' as const,
  fontFamily: 'monospace' as const,
};

export const labelStyle = {
  fontSize: 11,
  letterSpacing: 1.8,
  color: C.boneDim,
  fontFamily: 'monospace' as const,
  fontWeight: '700' as const,
};

export const cardStyle = {
  backgroundColor: C.panel,
  borderRadius: 10,
  borderWidth: 1,
  borderColor: 'rgba(194,158,77,0.45)',
  padding: 12,
};

export const chipStyle = {
  backgroundColor: C.panel2,
  borderRadius: 6,
  borderWidth: 0.5,
  borderColor: 'rgba(194,158,77,0.3)',
  paddingHorizontal: 8,
  paddingVertical: 4,
};

export const pressedStyle = { opacity: 0.75 };