import { config, fields, collection } from '@keystatic/core';

const categoryOptions = [
  { label: 'Food', value: 'food' },
  { label: 'Transport', value: 'transport' },
  { label: 'Culture', value: 'culture' },
  { label: 'Weather', value: 'weather' },
  { label: 'Budget', value: 'budget' },
  { label: 'Safety', value: 'safety' },
  { label: 'Planning', value: 'planning' },
  { label: 'Activities', value: 'activities' },
  { label: 'Accommodation', value: 'accommodation' },
];

const categoryOptionsVi = [
  { label: 'Ẩm thực', value: 'food' },
  { label: 'Di chuyển', value: 'transport' },
  { label: 'Văn hóa', value: 'culture' },
  { label: 'Thời tiết', value: 'weather' },
  { label: 'Chi phí', value: 'budget' },
  { label: 'An toàn', value: 'safety' },
  { label: 'Lập kế hoạch', value: 'planning' },
  { label: 'Hoạt động', value: 'activities' },
  { label: 'Lưu trú', value: 'accommodation' },
];

const questionFields = {
  title: fields.text({
    label: 'Title',
    validation: { length: { min: 10, max: 120 } },
  }),
  description: fields.text({
    label: 'Description',
    multiline: true,
    validation: { length: { min: 120, max: 165 } },
  }),
  canonicalSlug: fields.text({ label: 'Canonical Slug' }),
  city: fields.text({ label: 'City Slug' }),
  cityDisplay: fields.text({ label: 'City Display Name' }),
  category: fields.select({
    label: 'Category',
    options: categoryOptions,
    defaultValue: 'food',
  }),
  pubDate: fields.date({ label: 'Published Date' }),
  updatedDate: fields.date({ label: 'Updated Date' }),
  quickAnswer: fields.text({
    label: 'Quick Answer',
    multiline: true,
    validation: { length: { min: 80, max: 400 } },
  }),
  readingTime: fields.integer({ label: 'Reading Time (minutes)' }),
  faq: fields.array(
    fields.object({
      fields: {
        q: fields.text({ label: 'Question' }),
        a: fields.text({ label: 'Answer', multiline: true }),
      },
    }),
    {
      label: 'FAQ',
      itemLabel: (props) => props.fields.q.value,
    }
  ),
  keywords: fields.array(fields.text({ label: 'Keyword' }), {
    label: 'Keywords',
  }),
  author: fields.text({
    label: 'Author',
    defaultValue: 'Pholio Editorial',
  }),
  contributors: fields.array(fields.text({ label: 'Name' }), {
    label: 'Contributors',
  }),
  draft: fields.checkbox({ label: 'Draft', defaultValue: false }),
  featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
  heroImage: fields.text({ label: 'Hero Image Path' }),
  heroImageAlt: fields.text({ label: 'Hero Image Alt' }),
  content: fields.markdoc({
    label: 'Content',
    extension: 'md',
  }),
};

const questionFieldsVi = {
  title: fields.text({
    label: 'Tiêu đề',
    validation: { length: { min: 10, max: 120 } },
  }),
  description: fields.text({
    label: 'Mô tả',
    multiline: true,
    validation: { length: { min: 120, max: 165 } },
  }),
  canonicalSlug: fields.text({ label: 'Canonical Slug' }),
  city: fields.text({ label: 'City Slug' }),
  cityDisplay: fields.text({ label: 'Tên hiển thị thành phố' }),
  category: fields.select({
    label: 'Danh mục',
    options: categoryOptionsVi,
    defaultValue: 'food',
  }),
  pubDate: fields.date({ label: 'Ngày xuất bản' }),
  updatedDate: fields.date({ label: 'Ngày cập nhật' }),
  quickAnswer: fields.text({
    label: 'Câu trả lời nhanh',
    multiline: true,
    validation: { length: { min: 80, max: 400 } },
  }),
  readingTime: fields.integer({ label: 'Thời gian đọc (phút)' }),
  faq: fields.array(
    fields.object({
      fields: {
        q: fields.text({ label: 'Câu hỏi' }),
        a: fields.text({ label: 'Câu trả lời', multiline: true }),
      },
    }),
    {
      label: 'FAQ',
      itemLabel: (props) => props.fields.q.value,
    }
  ),
  keywords: fields.array(fields.text({ label: 'Từ khóa' }), {
    label: 'Từ khóa',
  }),
  author: fields.text({
    label: 'Tác giả',
    defaultValue: 'Pholio Editorial',
  }),
  contributors: fields.array(fields.text({ label: 'Tên' }), {
    label: 'Người đóng góp',
  }),
  draft: fields.checkbox({ label: 'Bản nháp', defaultValue: false }),
  featured: fields.checkbox({ label: 'Nổi bật', defaultValue: false }),
  heroImage: fields.text({ label: 'Đường dẫn ảnh bìa' }),
  heroImageAlt: fields.text({ label: 'Mô tả ảnh bìa' }),
  content: fields.markdoc({
    label: 'Nội dung',
    extension: 'md',
  }),
};

export default config({
  storage: { kind: 'cloud' },
  cloud: {
    project: 'pholio-cms/pholio-website',
  },

  collections: {
    questionsEn: collection({
      label: 'Questions (English)',
      slugField: 'canonicalSlug',
      path: 'src/content/questions/en/*',
      format: { contentField: 'content' },
      schema: questionFields,
    }),

    questionsVi: collection({
      label: 'Questions (Vietnamese)',
      slugField: 'canonicalSlug',
      path: 'src/content/questions/vi/*',
      format: { contentField: 'content' },
      schema: questionFieldsVi,
    }),

    cities: collection({
      label: 'Cities',
      slugField: 'slug',
      path: 'src/content/cities/*',
      format: { contentField: 'content' },
      schema: {
        name: fields.text({ label: 'City Name' }),
        slug: fields.text({ label: 'Slug' }),
        region: fields.text({ label: 'Region' }),
        tagline: fields.text({ label: 'Tagline' }),
        description: fields.text({ label: 'Description', multiline: true }),
        bestSeason: fields.text({ label: 'Best Season' }),
        daysRecommended: fields.text({ label: 'Days Recommended' }),
        budgetLevel: fields.select({
          label: 'Budget Level',
          options: [
            { label: 'Budget', value: 'budget' },
            { label: 'Mid-range', value: 'mid-range' },
            { label: 'Premium', value: 'premium' },
          ],
        }),
        featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
        heroImage: fields.text({ label: 'Hero Image Path' }),
        content: fields.markdoc({
          label: 'Description Body',
          extension: 'md',
        }),
      },
    }),
  },
});