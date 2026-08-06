const prisma = require('./src/lib/prisma').default;

async function main() {
  await prisma.$executeRawUnsafe(`
    create or replace function public.handle_new_user()
    returns trigger
    language plpgsql
    security definer set search_path = ''
    as $$
    begin
      insert into public.users (id, email, credits, plan_type)
      values (new.id, new.email, 5000, 'free');
      return new;
    end;
    $$;
  `);
  
  await prisma.$executeRawUnsafe(`drop trigger if exists on_auth_user_created on auth.users;`);
  
  await prisma.$executeRawUnsafe(`
    create trigger on_auth_user_created
      after insert on auth.users
      for each row execute procedure public.handle_new_user();
  `);
  console.log('Trigger created successfully');
}

main().catch(e => {
  console.error(e);
}).finally(() => {
  prisma.$disconnect();
});
