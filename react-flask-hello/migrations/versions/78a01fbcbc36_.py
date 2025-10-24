"""add legal fields

Revision ID: 78a01fbcbc36
Revises: c36b16ee7679
Create Date: 2025-10-24 17:30:33.381616

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '78a01fbcbc36'
down_revision = 'c36b16ee7679'
branch_labels = None
depends_on = None


def upgrade():
    # Obtener conexión e inspector para verificar estado actual
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    # Limpiar tablas temporales si existen
    table_names = inspector.get_table_names()
    for table_name in table_names:
        if table_name.startswith('_alembic_tmp'):
            print(f"🗑️ Eliminando tabla temporal: {table_name}")
            op.drop_table(table_name)
    
    # Agregar nuevas columnas con nullable=True
    with op.batch_alter_table('user', schema=None) as batch_op:
        # Verificar columnas existentes primero
        existing_columns = [c['name'] for c in inspector.get_columns('user')]
        
        # Solo agregar columnas que no existen
        if 'terms_accepted' not in existing_columns:
            batch_op.add_column(sa.Column('terms_accepted', sa.Boolean(), nullable=True, server_default=sa.text('0')))
        
        if 'terms_accepted_at' not in existing_columns:
            batch_op.add_column(sa.Column('terms_accepted_at', sa.DateTime(), nullable=True))
        
        if 'privacy_policy_accepted' not in existing_columns:
            batch_op.add_column(sa.Column('privacy_policy_accepted', sa.Boolean(), nullable=True, server_default=sa.text('0')))
        
        if 'privacy_policy_accepted_at' not in existing_columns:
            batch_op.add_column(sa.Column('privacy_policy_accepted_at', sa.DateTime(), nullable=True))
        
        if 'marketing_emails' not in existing_columns:
            batch_op.add_column(sa.Column('marketing_emails', sa.Boolean(), nullable=True, server_default=sa.text('0')))
        
        if 'marketing_emails_accepted_at' not in existing_columns:
            batch_op.add_column(sa.Column('marketing_emails_accepted_at', sa.DateTime(), nullable=True))
        
        # NO forzar nullable=False en columnas existentes - mantener su estado actual
        # Esto evita el error de constraints


def downgrade():
    # Obtener conexión e inspector
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    
    with op.batch_alter_table('user', schema=None) as batch_op:
        # Verificar qué columnas existen antes de eliminarlas
        existing_columns = [c['name'] for c in inspector.get_columns('user')]
        
        if 'marketing_emails_accepted_at' in existing_columns:
            batch_op.drop_column('marketing_emails_accepted_at')
        
        if 'marketing_emails' in existing_columns:
            batch_op.drop_column('marketing_emails')
        
        if 'privacy_policy_accepted_at' in existing_columns:
            batch_op.drop_column('privacy_policy_accepted_at')
        
        if 'privacy_policy_accepted' in existing_columns:
            batch_op.drop_column('privacy_policy_accepted')
        
        if 'terms_accepted_at' in existing_columns:
            batch_op.drop_column('terms_accepted_at')
        
        if 'terms_accepted' in existing_columns:
            batch_op.drop_column('terms_accepted')
        
        # NO revertir los cambios de nullable en el downgrade
        # Mantener el estado actual de las columnas