"""empty message

Revision ID: c36b16ee7679
Revises: 7a5f66eb4773
Create Date: 2025-10-24 12:13:15.527051

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c36b16ee7679'
down_revision = '7a5f66eb4773'
branch_labels = None
depends_on = None


def upgrade():
    # Limpiar tablas temporales si existen
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    if '_alembic_tmp_admin_users' in inspector.get_table_names():
        op.drop_table('_alembic_tmp_admin_users')
    
    if '_alembic_tmp_user' in inspector.get_table_names():
        op.drop_table('_alembic_tmp_user')
    
    # Cambiar tipo de columna role en admin_users (solo si la tabla existe)
    if 'admin_users' in inspector.get_table_names():
        with op.batch_alter_table('admin_users', schema=None) as batch_op:
            batch_op.alter_column('role',
                   existing_type=sa.VARCHAR(length=15),
                   type_=sa.String(length=20),
                   existing_nullable=True)
    
    # Agregar nuevas columnas a la tabla user
    with op.batch_alter_table('user', schema=None) as batch_op:
        # Verificar qué columnas ya existen
        existing_columns = [c['name'] for c in inspector.get_columns('user')]
        
        if 'google_id' not in existing_columns:
            batch_op.add_column(sa.Column('google_id', sa.String(length=255), nullable=True))
            batch_op.create_unique_constraint('uq_user_google_id', ['google_id'])
        
        if 'name' not in existing_columns:
            batch_op.add_column(sa.Column('name', sa.String(length=255), nullable=True))
        
        if 'picture' not in existing_columns:
            batch_op.add_column(sa.Column('picture', sa.Text(), nullable=True))
        
        if 'email_verified' not in existing_columns:
            batch_op.add_column(sa.Column('email_verified', sa.Boolean(), nullable=True))
        
        if 'role' not in existing_columns:
            batch_op.add_column(sa.Column('role', sa.String(length=20), nullable=True))
        
        if 'created_at' not in existing_columns:
            batch_op.add_column(sa.Column('created_at', sa.DateTime(), server_default=sa.func.now()))
        
        if 'updated_at' not in existing_columns:
            batch_op.add_column(sa.Column('updated_at', sa.DateTime(), server_default=sa.func.now(), onupdate=sa.func.now()))
        
        # Hacer la columna password nullable
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(),
               nullable=True)


def downgrade():
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('password',
               existing_type=sa.VARCHAR(),
               nullable=False)
        
        # Verificar qué constraints existen antes de eliminar
        conn = op.get_bind()
        inspector = sa.inspect(conn)
        constraints = [c['name'] for c in inspector.get_unique_constraints('user')]
        
        if 'uq_user_google_id' in constraints:
            batch_op.drop_constraint('uq_user_google_id', type_='unique')
        
        batch_op.drop_column('updated_at')
        batch_op.drop_column('created_at')
        batch_op.drop_column('role')
        batch_op.drop_column('email_verified')
        batch_op.drop_column('picture')
        batch_op.drop_column('name')
        batch_op.drop_column('google_id')
    
    if 'admin_users' in inspector.get_table_names():
        with op.batch_alter_table('admin_users', schema=None) as batch_op:
            batch_op.alter_column('role',
                   existing_type=sa.String(length=20),
                   type_=sa.VARCHAR(length=15),
                   existing_nullable=True)