import { EvidenceSource } from '@/shared/domain';

export const EVIDENCE_SOURCES: EvidenceSource[] = [
    {
        id: 'simarmata-2026',
        title:
            "Green Material & Process and Green Packaging as Drivers of Tourists' Sustainable Purchase Intention: Evidence from a PLS-SEM Study in Lake Toba, Indonesia",
        authors: 'Poltak Pardamean Simarmata, Doris Yolanda Saragih, Hengki Mangirng Parulian Simarmata',
        year: 2026,
        doi: '10.55606/makreju.v4i3.4450',
        variables: ['Green Packaging', 'Green Material & Process', 'Sustainable Purchase Intention'],
        findings: [
            { label: 'Green Packaging → Sustainable Purchase Intention', value: 'β = 0.662, t = 10.988, p < 0.001' },
            { label: 'Green Material & Process → Sustainable Purchase Intention', value: 'β = 0.207, t = 3.321, p = 0.001' },
            { label: 'R²', value: '0.699' },
            { label: 'Sample', value: '306 respondents' },
        ],
        note: 'β = 0.662 is a PLS-SEM path coefficient, not a decision weight — it is not interpreted as "green packaging gets 66.2% weight," a purchase probability, or system prediction accuracy. Used here only to justify why green packaging and sustainable materials are meaningful constructs in the prototype, not to define the ranking weights. The study is cross-sectional and conducted in a single destination (n = 306 tourists), so generalizability is limited.',
    },
    {
        id: 'simaremare-edison-2025',
        title: 'Active Persona literature (2025)',
        authors: 'Simaremare & Edison',
        year: 2025,
        variables: ['Persona construction methodology'],
        findings: [],
        note: 'Referenced as background for the illustrative persona construction approach used in this prototype.',
    },
    {
        id: 'simaremare-edison-2026',
        title: 'Active Persona literature (2026)',
        authors: 'Simaremare & Edison',
        year: 2026,
        variables: ['Persona construction methodology'],
        findings: [],
        note: 'Referenced as background for the illustrative persona construction approach used in this prototype.',
    },
    {
        id: 'opera-acl-2026',
        title: 'OPeRA framework',
        authors: 'ACL',
        year: 2026,
        variables: ['Evaluation / rationale-grounded agent framework'],
        findings: [],
        note: 'Referenced as conceptual background for structuring evaluation prompts and rationale generation in a future production Customer Twin.',
    },
    {
        id: 'bps-sumut-2026',
        title: 'Statistik pariwisata Provinsi Sumatera Utara',
        authors: 'BPS Provinsi Sumatera Utara',
        year: 2026,
        variables: ['Kunjungan wisatawan mancanegara melalui pintu masuk Sumatera Utara'],
        findings: [
            { label: '2024', value: '250,413 kunjungan' },
            { label: '2025', value: '292,481 kunjungan' },
            { label: 'Growth', value: '16.80%' },
        ],
        note: 'Data provinsi, bukan data kunjungan khusus Danau Toba. Digunakan hanya sebagai konteks pariwisata, bukan bukti permintaan produk berkelanjutan. Source: BPS Provinsi Sumatera Utara, 2 Februari 2026.',
    },
];
